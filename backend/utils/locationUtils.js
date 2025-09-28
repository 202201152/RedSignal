
export const getRoomNameFromCoords = (lat, lng) => {
    const roundedLat = Math.round(lat * 10) / 10;
    const roundedLng = Math.round(lng * 10) / 10;
    return `room_${roundedLat}_${roundedLng}`;
};