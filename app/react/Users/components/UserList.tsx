import React, { useState } from 'react';
import { Translate } from 'app/I18N';
import { Icon } from 'app/UI';
import { Pill } from 'app/Metadata/components/Pill';
import { UserSchema } from 'shared/types/userType';

export interface UserListProps {
  users: UserSchema[];
  handleSelect: (user: UserSchema) => void;
  handleAddUser: () => void;
  className: string;
}

export const UserListComponent = ({
  users,
  handleSelect,
  handleAddUser,
  className,
}: UserListProps) => {
  const [selectedId, setSelectedId] = useState();
  const selectRow = (user: UserSchema) => {
    handleSelect(user);
  };
  const addUser = () => {
    setSelectedId(undefined);
    handleAddUser();
  };
  return (
    <div className="user-list">
      <table className={className}>
        <thead>
          <th>
            <Translate>Name</Translate>
          </th>
          <th>
            <Translate>Protection</Translate>
          </th>
          <th>
            <Translate>Role</Translate>
          </th>
          <th>
            <Translate>Groups</Translate>
          </th>
        </thead>
        <tbody>
          {users.map((user: UserSchema) => {
            const protection = user.using2fa ? 'Password + 2FA' : 'Password';
            return (
              <tr
                className={selectedId === user._id ? 'selected' : ''}
                key={user._id?.toString()}
                onClick={() => selectRow(user)}
              >
                <td>{user.username}</td>
                <td>
                  <Pill color={protection ? 'lightgray' : 'green'}>{protection}</Pill>
                </td>
                <td>
                  <Pill color="white">{user.role}</Pill>
                </td>
                <td>
                  {user.groups?.map(group => (
                    <Pill key={group._id?.toString()} color="white">
                      <>
                        <Icon icon="users" />
                        {` ${group.name}`}
                      </>
                    </Pill>
                  ))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className={`settings-footer ${className}`}>
        <button type="button" className="btn btn-success" onClick={addUser}>
          <Icon icon="plus" />
          <span className="btn-label">
            <Translate>Add User</Translate>
          </span>
        </button>
      </div>
    </div>
  );
};

export const UserList = UserListComponent;