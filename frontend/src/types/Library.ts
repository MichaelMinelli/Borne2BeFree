interface Library {
    id: string,
    logo?: string,
    name: string,
    apiName: string,
    organizationName: string,
    currency: string,
    featureImage?: string,
    logoutTime: number,
    token: string
}


type LibraryResume = Pick<Library, 'name' | 'apiName'>


export type { Library, LibraryResume };