import { Zone } from './Zone';
import { z }    from 'zod';


const UserConfig = z.strictObject({
                                      jwtSecret: z.string(),
                                      zones    : z.array(Zone)
                                  });

type UserConfig = z.infer<typeof UserConfig>;


export { UserConfig };
