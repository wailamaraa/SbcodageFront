import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usersApi } from '../../services/api/users';
import { User } from '../../types';
import { BaseForm } from '../../components/common/BaseForm';
import { useForm } from '../../hooks/useForm';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const UserForm: React.FC = () => {
  const { id } = useParams();
  const {
    data,
    isLoading,
    handleSubmit,
    handleInputChange
  } = useForm<User>({
    service: usersApi,
    basePath: '/users',
    id
  });

  useEffect(() => {
    if (id) {
      // Load user data if editing
      usersApi.getById(id).then(response => {
        if (response?.success) {
          Object.entries(response.data).forEach(([key, value]) => {
            const input = document.querySelector(`[name="${key}"]`) as HTMLInputElement;
            if (input) {
              input.value = value as string;
            }
          });
        }
      });
    }
  }, [id]);

  return (
    <BaseForm
      title={id ? 'Edit User' : 'New User'}
      basePath="/users"
      isLoading={isLoading}
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        <div>
          <Input
            label="Name"
            name="name"
            value={data.name || ''}
            onChange={handleInputChange}
            required
            placeholder="Enter user name"
          />
        </div>

        <div>
          <Input
            label="Email"
            name="email"
            type="email"
            value={data.email || ''}
            onChange={handleInputChange}
            required
            placeholder="Enter user email"
          />
        </div>

        {!id && (
          <div>
            <Input
              label="Password"
              name="password"
              type="password"
              value={data.password || ''}
              onChange={handleInputChange}
              required={!id}
              placeholder="Enter password"
            />
          </div>
        )}

        <div>
          <Select
            label="Role"
            name="role"
            value={data.role || ''}
            onChange={handleInputChange}
            required
            options={[
              { value: 'user', label: 'User' },
              { value: 'admin', label: 'Admin' }
            ]}
          />
        </div>
      </div>
    </BaseForm>
  );
};

export default UserForm;