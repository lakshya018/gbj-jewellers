export const Users = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
    create: () => true, // Allow anyone to register (sign up)
    delete: ({ req: { user } }) => user?.role === 'admin',
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true;
      return { id: { equals: user?.id } };
    },
    update: ({ req: { user } }) => {
      if (user?.role === 'admin') return true;
      return { id: { equals: user?.id } };
    },
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'user',
      required: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
      access: {
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
  ],
};
