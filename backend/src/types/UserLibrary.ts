import { z } from 'zod';


const UserLibrary = z.strictObject({
                                       code: z.string(),

                                       logo        : z.string().optional(),
                                       featureImage: z.string().optional(),

                                       name        : z.string(),
                                       organization: z.string(),

                                       apiName    : z.string(),
                                       apiCircDesk: z.string(),

                                       permitIpAddresses: z.array(z.string()).optional()
                                   });

type UserLibrary = z.infer<typeof UserLibrary>;

export { UserLibrary };