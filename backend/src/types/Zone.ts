import { UserLibrary } from './UserLibrary';
import { z }           from 'zod';


const Zone = z.strictObject({
                                name      : z.string(),
                                hostname  : z.string(),
                                apiKey    : z.string(),
                                currency  : z.string(),
                                logoutTime: z.number(),
                                libraries : z.array(UserLibrary)
                            });

type Zone = z.infer<typeof Zone>;


export { Zone };