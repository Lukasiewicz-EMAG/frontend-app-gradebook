import { keyStore } from 'utils';
import actions from 'data/actions';

import { actionHook } from './utils';
import actionHooks from './actions';

jest.mock('data/actions', () => ({
  app: {
    setLocalFilter: jest.fn(),
    setView: jest.fn(),
  },
  filters: {
    update: {
      assignment: jest.fn(),
      assignmentLimits: jest.fn(),
    },
  },
  grades: {
    downloadReport: {
      bulkGrades: jest.fn(),
    },
  },
}));
jest.mock('./utils', () => ({
  actionHook: (action) => ({ actionHook: action }),
}));

let hooks;

const testActionHook = (hookKey, action) => {
  test(hookKey, () => {
    expect(hooks[hookKey]).toEqual(actionHook(action));
  });
};

describe('action hooks', () => {
  describe('app', () => {
    const hookKeys = keyStore(actionHooks.app);
    beforeEach(() => { hooks = actionHooks.app; });
    testActionHook(hookKeys.useSetLocalFilter, actions.app.setLocalFilter);
    testActionHook(hookKeys.useSetView, actions.app.setView);
  });
  describe('filters', () => {
    const hookKeys = keyStore(actionHooks.filters);
    const actionGroup = actions.filters.update;
    beforeEach(() => { hooks = actionHooks.filters; });
    testActionHook(hookKeys.useUpdateAssignment, actionGroup.assignment);
    testActionHook(hookKeys.useUpdateAssignmentLimits, actionGroup.assignmentLimits);
    testActionHook(hookKeys.useUpdateCohort, actionGroup.updateCohort);
    testActionHook(hookKeys.useUpdateCourseGradeLimits, actionGroup.courseGradeLimits);
    testActionHook(
      hookKeys.useUpdateIncludeCourseRoleMembers,
      actionGroup.updateIncludeCourseRoleMembers,
    );
    testActionHook(hookKeys.useUpdateTrack, actionGroup.updateTrack);
  });
  describe('grades', () => {
    beforeEach(() => { hooks = actionHooks.grades; });
    test('downloadReport.useBulkGrades', () => {
      expect(hooks.downloadReport.useBulkGrades)
        .toEqual(actionHook(actions.grades.downloadReport.bulkGrades));
    });
  });
});
