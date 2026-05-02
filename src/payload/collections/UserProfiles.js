export const UserProfiles = {
  slug: 'user-profiles',
  admin: {
    useAsTitle: 'clerkUserId',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'clerkUserId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'savedAddresses',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          admin: {
            placeholder: 'Home, Office, etc.',
          },
        },
        {
          name: 'fullName',
          type: 'text',
          required: true,
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
        },
        {
          name: 'email',
          type: 'text',
        },
        {
          name: 'line1',
          type: 'text',
          required: true,
        },
        {
          name: 'line2',
          type: 'text',
        },
        {
          name: 'city',
          type: 'text',
          required: true,
        },
        {
          name: 'state',
          type: 'text',
          required: true,
        },
        {
          name: 'pincode',
          type: 'text',
          required: true,
        },
        {
          name: 'isDefault',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
  ],
};
