/**
 * Academy feature (Phase 2, read-only): the export contract the shell mounts.
 *   /academy             AcademyOutline (Levels 0 to 8, the real lessons in order)
 *   /academy/:lessonId   LessonPage (reads the :lessonId route param itself)
 *   /sops                SopList (every procedure by stage)
 *   /sops/:id            SopPage (reads the :id route param itself)
 * Drills, quizzes, flashcards, crew profiles, and sign-off arrive with the Phase 5 Academy app.
 */
export { AcademyOutline } from './AcademyOutline';
export { LessonPage } from './LessonPage';
export { SopList } from './SopList';
export { SopPage } from './SopPage';
export { PHASE_5_LINE } from './academyModel';
