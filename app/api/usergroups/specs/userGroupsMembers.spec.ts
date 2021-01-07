import db from 'api/utils/testing_db';
import { getByMemberIdList, updateUserMemberships } from 'api/usergroups/userGroupsMembers';
import { UserRole } from 'shared/types/userSchema';
import userGroups from 'api/usergroups/userGroups';
import fixtures, { group1Id, group2Id, user1Id } from './fixtures.js';

describe('userGroupsMembers', () => {
  beforeEach(async () => {
    await db.clearAllAndLoad(fixtures);
  });

  describe('getByMemberIdList', () => {
    it('should return the groups that contains the asked member ids', async () => {
      const groups = await getByMemberIdList([user1Id.toString()]);
      expect(groups[0]._id?.toString()).toBe(group2Id.toString());
      expect(groups[0].name).toBe('Group 2');
    });
  });

  describe('updateUserMemberships', () => {
    it('should return the groups that contains the asked member ids', async () => {
      const userToUpdate = {
        ...fixtures.users[0],
        role: UserRole.COLLABORATOR,
        groups: [{ _id: group1Id.toString() }],
      };
      await updateUserMemberships(userToUpdate);
      const groups = await userGroups.get({}, { members: 1 });
      const newGroup1Members =
        groups.find(group => group._id!.toString() === group1Id.toString())?.members || [];
      const newGroup2Members =
        groups.find(group => group._id!.toString() === group2Id.toString())?.members || [];
      expect(
        newGroup1Members.find(m => m._id.toString() === userToUpdate._id.toString())
      ).not.toBeUndefined();
      expect(
        newGroup2Members.find(m => m._id.toString() === userToUpdate._id.toString())
      ).toBeUndefined();
    });
  });
});