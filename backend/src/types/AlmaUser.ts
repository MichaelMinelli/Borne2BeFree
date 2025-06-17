interface AlmaUser {
    pref_first_name?: string;
    first_name: string;
    pref_last_name?: string;
    last_name: string;
    loans: { value: number };
    requests: { value: number };
    fees: { value: number };
    primary_id: string;
}


export type { AlmaUser };