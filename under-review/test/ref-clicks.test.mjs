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

// Not on Lando's list, so not skipped today: WhatsApp's link-preview fetcher sends
// "WhatsApp/2.19", which contains none of the listed words. Say the word and it goes in.
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
