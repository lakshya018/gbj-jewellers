export const Categories = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      hooks: {
        beforeValidate: [
          ({ data }) => {
            if (data?.name) {
              return data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            }
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'tagline',
      type: 'text',
      admin: {
        description: 'Short catchy phrase (e.g. Timeless Traditions)',
      },
    },
    {
      name: 'accentColor',
      type: 'text',
      admin: {
        description: 'Hex color code for UI accents (e.g. #c9962a)',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
};
