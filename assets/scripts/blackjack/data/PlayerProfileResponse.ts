export interface PlayerProfileResponse {
    isMe: boolean;
    balance: number;
    isPlayerOfMonth: boolean;
    name: string;
    id: number;
    avatar: number;
}

// Example: Convert from JSON array into a PlayerProfile object
export function PlayerProfileResponse(data: any[]): PlayerProfileResponse {
    const obj: any = {};
    for (const entry of data) {
        obj[entry.key] = entry.value.value;
    }
    return {
        isMe: obj["is_me"] ?? false,
        balance: obj["balance"] ?? 0,
        isPlayerOfMonth: obj["is_player_of_month"] ?? false,
        name: obj["name"] ?? "",
        id: obj["id"] ?? 0,
        avatar: obj["avatar"] ?? 0,
    };
}
