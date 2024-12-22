declare interface ResponseRunning {
    running?: boolean
}
declare interface ResponseConfig {
    enabled?: boolean
    acceptRoutes?: boolean
    advertiseExitNode?: boolean
    notAcceptDns?: boolean
    shieldsUp?: boolean
    statefulFiltering?: boolean
    exitNodeAllowLan?: boolean
    hostname?: string
    customFlags?: string
    advertiseRoutes?: string
    exitNodeConnect?: string
    loginServer?: string
    authkey?: string
}

// 
declare interface ResponseStatus {
    Version?: string
    // 服务状态
    BackendState?: string
    // 是否有绑定链接
    AuthURL?: string
    TailscaleIPs?: string[]
    Health?: string[]
    MagicDNSSuffix?: string
    // 当前节点
    Self?: ResponseStatusSelf
    // 已绑定用户
    User?: {
        [key: string]: ResponseStatusUser
    }
    Peer?: {
        [key: string]: ResponseStatusPeer
    }
}
declare interface ResponseStatusUser {
    ID?: number
    LoginName?: string
    DisplayName?: string
    ProfilePicURL?: string
    Roles?: any[]
}
declare interface ResponseStatusPeer {
    Online: boolean
    DNSName: string
    TailscaleIPs: string[]
    ExitNodeOption: string
    Relay: string
}
declare interface ResponseStatusSelf {
    ID: string
    PublicKey: string
    HostName: string
    DNSName: string
    OS: string
    UserID: number
    TailscaleIPs: string[]
    Addrs: string[]
    CurAddr: string
    Relay: string
    RxBytes: number
    TxBytes: number
    Created: string
    LastWrite: string
    LastSeen: string
    LastHandshake: string
    Online: boolean
    KeepAlive: boolean
    ExitNode: boolean
    ExitNodeOption: boolean
    Active: boolean
    PeerAPIURL: any
    InNetworkMap: boolean
    InMagicSock: boolean
    InEngine: boolean
}



