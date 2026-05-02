export const Wishlists = {
  slug: 'wishlists',
  admin: {
    useAsTitle: 'firebaseUid',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'firebaseUid',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
      ],
    },
  ],
};
