import Device from "./Device";

type User = {
    name: string,
    isOnline: boolean,
    devices: Device[]
};

export default User;
