<template>
    <div id="main">
        <!--  -->
        <h2>Tailscale</h2>
        <div class="cbi-map-descr">
            Tailscale creates a virtual network between hosts.<br>
            It can be used as a simple mechanism to allow remote administration without port forwarding or even be configured to allow peers in your virtual network to proxy traffic through connected devices as an ad-hoc vpn.<br><br>
            Offical Site : <a href="https://tailscale.com" target="_blank">Tailscale</a><br>
            Initial Setup : <a href="https://openwrt.org/docs/guide-user/services/vpn/tailscale/start" target="_blank">OpenWrt Tailscale User Guide</a><br>
            Admin Console : <a href="https://login.tailscale.com/admin" target="_blank">Tailscale Admin Console</a><br>
            Latest Tailscale : <a href="https://pkgs.tailscale.com/stable/" target="_blank">Tailscale Packages - stable track - Eg : tailscale_1.78.1_mipsle.tgz</a><br>
            Latest Combined Binary : <a href="https://github.com/singlag/glinet-tailscale-updater/releases" target="_blank">Tailscale Tiny Combined Binary</a><br>
            ----Version 1.66.4 non-upx packed combined executables run ok on MT7620 128MB ram devices with usb storage<br>
            ----Version 1.78.1 run slow and high memory usage on MT7620 128MB ram devices with usb storage<br>
            <!--
            uname -m
            echo -n I | hexdump -o | awk '{ print (substr($2,6,1)=="1") ? "le" : ""; exit }'
            https://pkgs.tailscale.com/stable/tailscale_1.78.1_mipsle.tgz
            -->
            
        </div>
        <!--  -->
        <div class="cbi-section">
            <h3>Service Status</h3>
            <div class="cbi-section-node">
                <div class="cbi-value cbi-value-last">
                    <label class="cbi-value-title">Enable</label>
                    <div class="cbi-value-field">
                        <div class="cbi-checkbox">
                            <input name="enabled" type="checkbox" :value="false" v-model="config.enabled">
                            <label></label>
                        </div>
                    </div>
                </div>
                <div class="cbi-value cbi-value-last">
                    <label class="cbi-value-title">Service Status</label>
                    <div class="cbi-value-field">
                        <a v-if="loading">Loading...</a>
                        <template v-else>
                            <a v-if="status?.BackendState" style="color:green"> {{ status?.BackendState }}</a>
                            <a v-else style="color:red">Not running</a>
                        </template>
                    </div>
                </div>
                <div class="cbi-value cbi-value-last" v-if="status?.Self?.ID">
                    <label class="cbi-value-title">Current Node</label>
                    <div class="cbi-value-field">
                        <a>
                            {{ status?.Self?.ID }}
                            <template v-if="status?.Self?.HostName">
                                （{{ status.Self.HostName }}）
                            </template>
                        </a>
                    </div>
                </div>
                <div class="cbi-value cbi-value-last" v-if="status?.AuthURL">
                    <label class="cbi-value-title">Verify Binding</label>
                    <div class="cbi-value-field">
                        <a :href="status.AuthURL" target="_blank">{{ status.AuthURL }}</a>
                    </div>
                </div>
                <div class="cbi-value cbi-value-last" v-if="user?.DisplayName">
                    <label class="cbi-value-title">Binded User</label>
                    <div class="cbi-value-field">
                        <a href="https://login.tailscale.com/admin/machines/" target="_blank">{{ user.DisplayName }}</a>
                        <br />
                        <a @click="onLogout" style="color:green">Log out and unbind</a>
                    </div>
                </div>
            </div>
        </div>
        <!--  -->
        <div class="cbi-section">
            <h3>Global Settings</h3>
            <div class="cbi-section-node">
                <!--  -->
                <div class="cbi-value">
                    <label class="cbi-value-title">Machine Name</label>
                    <div class="cbi-value-field">
                        <div>
                            <input type="text" class="cbi-input-text" name="hostname" v-model.trim="config.hostname"
                                placeholder="Example: iStoreOS">
                        </div>
                        <div class="cbi-value-description">
                            Leave blank to use the device's name
                        </div>
                    </div>
                </div>
                <!--  -->
                <div class="cbi-value">
                    <label class="cbi-value-title">Disable Tailscale DNS</label>
                    <div class="cbi-value-field">
                        <div class="cbi-checkbox">
                            <input name="notAcceptDns" type="checkbox" :value="false" v-model="config.notAcceptDns">
                            <label></label>
                        </div>
                        <div class="cbi-value-description">
                            Use local DNS, then you need to map Tailscale IP addresses to local DNS by yourself. (Check /etc/resolv.conf)
                        </div>
                    </div>
                </div>
                <!--  -->
                <div class="cbi-value">
                    <label class="cbi-value-title">Block incoming connections (shields-up)</label>
                    <div class="cbi-value-field">
                        <div class="cbi-checkbox">
                            <input name="shieldsUp" type="checkbox" :value="false" v-model="config.shieldsUp">
                            <label></label>
                        </div>
                        <div class="cbi-value-description">
                            Block incoming connections from other devices on your Tailscale network including pings. Useful for personal devices that only make outgoing connections.
                        </div>
                    </div>
                </div>
                <!--  -->
                <div class="cbi-value">
                    <label class="cbi-value-title">Advertise Exit Node</label>
                    <div class="cbi-value-field">
                        <div class="cbi-checkbox">
                            <input name="advertiseExitNode" type="checkbox" :value="false" v-model="config.advertiseExitNode">
                            <label></label>
                        </div>
                        <div class="cbi-value-description">
                            Allow other client to route public internet traffic to here then to internet (Remeber to enable "Use as exit node" at Admin Console)
                        </div>
                    </div>
                </div>
                <!--  -->
                <div class="cbi-value">
                    <label class="cbi-value-title">Accept Subnet Routes</label>
                    <div class="cbi-value-field">
                        <div class="cbi-checkbox">
                            <input name="acceptroutes" type="checkbox" :value="false" v-model="config.acceptRoutes">
                            <label></label>
                        </div>
                        <div class="cbi-value-description">
                            If an Admin has created subnet routes for your tailnet, then Tailscale will route your device's traffic for the advertised subnets to the appropriate subnet router. (Join to other subnet)
                        </div>
                    </div>
                </div>
                <!--  -->
                <div class="cbi-value">
                    <label class="cbi-value-title">Expose subnet route to Tailscale</label>
                    <div class="cbi-value-field">
                        <div>
                            <input type="text" class="cbi-input-text" name="advertiseroutes" placeholder="Use , separated list of IP Address"
                                v-model.trim="config.advertiseRoutes">
                        </div>
                        <div class="cbi-value-description">
                            Share your subnets such as <code>192.168.1.0/24</code> to other devices, leave blank to disable (Remeber to enable "Subnet Route" at Admin Console)
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--  -->
        <div class="cbi-section">
            <h3>Custom Server</h3>
            <div class="cbi-section-descr">
                Deploy a private server by
                <a href="https://github.com/juanfont/headscale" target="_blank">headscale</a>
            </div>
            <div class="cbi-section-node">
                <!--  -->
                <div class="cbi-value">
                    <label class="cbi-value-title">Serve Address</label>
                    <div class="cbi-value-field">
                        <div>
                            <input type="text" class="cbi-input-text" name="loginserver" v-model.trim="config.loginServer"
                                placeholder="server IP Address, Leave blank if not used.">
                        </div>
                    </div>
                </div>
                <!--  -->
                <div class="cbi-value">
                    <label class="cbi-value-title">Tokens</label>
                    <div class="cbi-value-field">
                        <div>
                            <input type="password" class="cbi-input-password" name="authkey" v-model.trim="config.authkey"
                                placeholder="Tokens, Leave blank if not used.">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--  -->
        <span class="cbi-page-actions control-group">
            <button class="btn cbi-button cbi-button-apply" @click="onSubmit" :disabled="disabled">Save and Apply</button>
        </span>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
const BASEURL = "/cgi-bin/luci/admin/services/tailscaler"
const loading = ref(true)
const disabled = ref(false)
const config = ref<ResponseConfig>({})
const status = ref<ResponseStatus>({})
const user = ref<ResponseStatusUser>({})
const userID = ref<number>()
const request = (input: string, init?: RequestInit | undefined) => {
    const uri = `${BASEURL}${input}`
    return fetch(uri, init)
}
const getStatus = async () => {
    try {
        const resp = await request("/status", {
            method: "GET"
        })
        const res = await resp.json() as ResponseStatus
        if (res) {
            status.value = res
            if (res.Self) {
                userID.value = res.Self.UserID
            }
            if (res?.User) {
                if (userID.value) {
                    const userid = userID.value
                    for (const key in res.User) {
                        if (Object.prototype.hasOwnProperty.call(res.User, key)) {
                            const element = res.User[key];
                            if (element.ID === userid) {
                                user.value = element
                                break
                            }
                        }
                    }
                }
                if (!user.value?.ID) {
                    for (const key in res.User) {
                        if (Object.prototype.hasOwnProperty.call(res.User, key)) {
                            const element = res.User[key];
                            if (element) {
                                user.value = element
                                break
                            }
                        }
                    }
                }
            } else {
                user.value = {}
            }
        } else {
            status.value = {}
        }
    } catch (error) {
        // 拿不到数据则认为程序没启动
        console.log(error);
        status.value = {}
        user.value = {}
    }
}
const getConfig = async () => {
    try {
        const resp = await request("/config", {
            method: "GET"
        })
        const res = await resp.json() as ResponseConfig
        if (res) {
            config.value = res
        }
    } catch (error) {
        console.log(error);
    }
}
const getData = async () => {
    try {
        await Promise.all([
            getConfig(),
            getStatus(),
        ])
    } catch (error) {
    } finally {
        loading.value = false
    }
}
const getInterval = async () => {
    setInterval(() => {
        getStatus()
    }, 5000)
}
getInterval()
getData()
const onSubmit = async () => {
    try {
        const resp = await request("/config", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(config.value),
        })
        if (resp) {

        }
    } catch (error) {
        console.log(error);
    } finally {
        location.reload()
    }

}
const onLogout = async () => {
    if (!confirm("Do you want to log out and unbind the current device?")) {
        return
    }
    try {
        const resp = await request("/logout", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        })
        if (resp) {
        }
    } catch (error) {
        console.log(error);
    } finally {
        location.reload()
    }
}
</script>
<style lang="scss" scoped></style>
