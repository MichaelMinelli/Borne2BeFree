import { z } from 'zod';


const UserLibrary = z.strictObject({
                                       password: z.string(),

                                       logo        : z.string().optional(),
                                       featureImage: z.string().optional(),

                                       name        : z.string(),
                                       organization: z.string(),

                                       description: z.string().optional(),

                                       logoutTime: z.number().optional(),

                                       apiName    : z.string(),
                                       apiCircDesk: z.string(),

                                       permitIpAddresses: z.array(z.string()).optional()
                                   });

type UserLibrary = z.infer<typeof UserLibrary>;

export { UserLibrary };