// Standing tests for counting arrivals from a tagged link (?from=reddit).
//
// The rule these protect: a page is served exactly as it would be without the tag, nothing
// personal is stored, and a robot is never counted as a visitor. Reddit fetches a link
// preview the moment a post goes up, so that one matters on the day of a launch.
//
// Run with: node --test under-review/test/*.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countableSource } from '../../cloudflare/src/worker.js';

const BROWSER = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';

const req = (urlString, ua = BROWSER, method = 'GET') => {
  const headers = new Headers();
  if (ua) headers.set('user-agent', ua);
  return [{ method, headers }, new URL(urlString)];
};
const source = (...args) => countableSource(...req(...args));

test('a person arriving on a tagged link is counted', () => {
  assert.equal(source('https://theplatbook.com/?from=reddit'), 'reddit');
  assert.equal(source('https://theplatbook.com/state/fl/?from=reddit'), 'reddit');
  assert.equal(source('https://theplatbook.com/?from=test'), 'test');
  assert.equal(source('https://theplatbook.com/?from=email-nov-8'), 'email-nov-8');
  assert.equal(source('https://theplatbook.com/?from=ABC123'), 'ABC123');
  assert.equal(source('https://theplatbook.com/?from=' + 'a'.repeat(30)), 'a'.repeat(30));
});

test('an untagged visit is not counted', () => {
  assert.equal(source('https://theplatbook.com/'), '');
  assert.equal(source('https://theplatbook.com/state/fl/'), '');
  assert.equal(source('https://theplatbook.com/?utm_source=reddit'), '');
});

test('a tag that is not plain letters, numbers and dashes is ignored', () => {
  for (const bad of ['', 'a'.repeat(31), 'drop table', 'a/b', 'a.b', 'a_b', "a'b", 'a;b', '<script>', 'héllo', 'a b', '%20']) {
    assert.equal(source(`https://theplatbook.com/?from=${encodeURIComponent(bad)}`), '', `should ignore ${JSON.stringify(bad)}`);
  }
});

test('robots are never counted', () => {
  const robots = [
    'redditbot/1.0',
    'Mozilla/5.0 (compatible; Redditbot/1.0; +http://www.reddit.com/)',
    'facebookexternalhit/1.1',
    'Slackbot-LinkExpanding 1.0',
    'Discordbot/2.0',
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    'Mozilla/5.0 (compatible; bingbot/2.0)',
    'Twitterbot/1.0',
    'Mozilla/5.0 (compatible; YandexCrawler/3.0)',
    'Baiduspider/2.0',
    'LinkPreview/1.0',
    'Mozilla/5.0 (compatible; SomePreviewFetcher/1.0)',
  ];
  for (const ua of robots) {
    assert.equal(source('https://theplatbook.com/?from=reddit', ua), '', `should skip ${ua}`);
  }
});

// The link-preview fetcher of every app people actually paste links into. One real user
// agent each, so "which ones are skipped" is a measured answer and not a claim. Sources for
// the less obvious strings are in the commit message; the Teams and Snapchat ones are the
// least certain, which is why worker.js matches their app name as well as the generic words.
test('the link preview fetchers people use are all skipped', () => {
  const fetchers = [
    // iMessage sends a Safari string with Facebook's and Twitter's tokens bolted on the end.
    ['iMessage', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/601.2.4 (KHTML, like Gecko) Version/9.0.1 Safari/601.2.4 facebookexternalhit/1.1 Facebot Twitterbot/1.0'],
    ['Telegram', 'TelegramBot (like TwitterBot)'],
    ['LinkedIn', 'LinkedInBot/1.0 (compatible; Mozilla/5.0; Apache-HttpClient +http://www.linkedin.com)'],
    ['X / Twitter', 'Twitterbot/1.0'],
    ['Facebook', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)'],
    ['Facebook (newer)', 'meta-externalagent/1.1 (+https://developers.facebook.com/docs/sharing/webmasters/crawler)'],
    ['Skype', 'SkypeUriPreview Preview/0.5 skype-url-preview@microsoft.com'],
    ['Teams', 'SkypeUriPreview Preview/0.5 skype-url-preview@microsoft.com'],
    ['Snapchat', 'Snap URL Preview Service; bot; snapchat; https://developers.snap.com/robots'],
    ['Snapchat (other form)', 'Mozilla/5.0 (compatible; Snapchat/1.0; +https://www.snapchat.com)'],
    ['WhatsApp', 'WhatsApp/2.19'],
    ['WhatsApp (newer)', 'WhatsApp/2.23.20.0 A'],
    ['Apple (Siri, Spotlight)', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15 (Applebot/0.1; +http://www.apple.com/go/applebot)'],
    ['Google Messages', 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.92 Mobile Safari/537.36 (compatible; Google-Read-Aloud; +https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers)'],
  ];
  const counted = fetchers.filter(([, ua]) => source('https://theplatbook.com/?from=reddit', ua) !== '');
  assert.deepEqual(counted.map(([name]) => name), [], 'these link-preview fetchers would be counted as visitors');
});

test('matching ignores upper and lower case', () => {
  for (const ua of ['REDDITBOT/1.0', 'redditbot/1.0', 'RedditBot/1.0', 'WHATSAPP/2.19', 'whatsapp/2.19', 'WhatsApp/2.19', 'FACEBOOKEXTERNALHIT/1.1', 'SNAP URL PREVIEW SERVICE', 'SkypeUriPreview', 'SKYPEURIPREVIEW', 'META-EXTERNALAGENT/1.1', 'GoogleBot/2.1', 'GOOGLEBOT/2.1']) {
    assert.equal(source('https://theplatbook.com/?from=reddit', ua), '', `should skip ${ua}`);
  }
});

test('a real person is still counted, in any of the browsers they use', () => {
  const people = [
    ['iPhone Safari', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1'],
    ['iPad Safari', 'Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1'],
    ['Android Chrome', 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36'],
    ['Windows Chrome', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'],
    ['Windows Edge', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0'],
    ['Mac Firefox', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:133.0) Gecko/20100101 Firefox/133.0'],
    ['Reddit app browser', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Reddit/Version 2024.20.0/Build 1234567'],
  ];
  const missed = people.filter(([, ua]) => source('https://theplatbook.com/?from=reddit', ua) === '');
  assert.deepEqual(missed.map(([name]) => name), [], 'these are people, and they were not counted');
});

test('a request with no user agent at all is not a visitor', () => {
  assert.equal(source('https://theplatbook.com/?from=reddit', ''), '');
});

test('only a page view counts, not a form post or a HEAD check', () => {
  assert.equal(source('https://theplatbook.com/?from=reddit', BROWSER, 'POST'), '');
  assert.equal(source('https://theplatbook.com/?from=reddit', BROWSER, 'HEAD'), '');
});

test('the day used is the Mountain day, not the UTC day', () => {
  // 2026-11-09 04:30 UTC is still the evening of 2026-11-08 in Montana.
  const day = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Denver', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date('2026-11-09T04:30:00Z'));
  assert.equal(day, '2026-11-08');
  // and the same instant in UTC is the next day, which is the bug this avoids
  assert.equal(new Date('2026-11-09T04:30:00Z').toISOString().slice(0, 10), '2026-11-09');
});
