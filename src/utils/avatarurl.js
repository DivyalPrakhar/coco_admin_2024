export function getUserAvatarMock (gender) {
    return `https://joeschmoe.io/api/v1/${gender? gender+"/" :""} random`
}