import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';

import { Products } from './src/payload/collections/Products.js';
import { Categories } from './src/payload/collections/Categories.js';
import { Enquiries } from './src/payload/collections/Enquiries.js';
import { Banners } from './src/payload/collections/Banners.js';
import { Carts } from './src/payload/collections/Carts.js';
import { Wishlists } from './src/payload/collections/Wishlists.js';
import { Orders } from './src/payload/collections/Orders.js';
import { UserProfiles } from './src/payload/collections/UserProfiles.js';
import { Users } from './src/payload/collections/Users.js';

export default buildConfig({
  admin: {
    user: 'users',
    // Only allow admins to access the dashboard
    access: ({ user }) => user?.role === 'admin',
  },
  editor: lexicalEditor(),
  collections: [
    Products,
    Categories,
    Enquiries,
    Banners,
    Carts,
    Wishlists,
    Orders,
    UserProfiles,
    Users,
    {
      slug: 'media',
      upload: {
        staticDir: 'public/media',
        staticURL: '/media',
        mimeTypes: ['image/*'],
      },
      fields: [
        {
          name: 'alt',
          type: 'text',
        },
      ],
    },
  ],
  secret: process.env.PAYLOAD_SECRET || 'fallback-secret',
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  plugins: [
    vercelBlobStorage({
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
});
