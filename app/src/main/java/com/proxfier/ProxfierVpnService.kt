package com.proxfier

import android.content.Intent
import android.net.VpnService
import android.os.ParcelFileDescriptor
import android.util.Log

class ProxfierVpnService : VpnService() {

    private var vpnInterface: ParcelFileDescriptor? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val action = intent?.action
        if (action == "STOP") {
            stopVpn()
            return START_NOT_STICKY
        }
        
        startVpn()
        return START_STICKY
    }

    private fun startVpn() {
        try {
            val builder = Builder()
            builder.setSession("Proxfier")
                .addAddress("10.0.0.1", 24)
                .addDnsServer("8.8.8.8")
                .addRoute("0.0.0.0", 0) // Route all traffic through VPN
                
            vpnInterface = builder.establish()
            
            Log.i("ProxfierVPN", "VPN Interface established")
            
            // Here we would pass vpnInterface!!.fileDescriptor to sing-box
            // Example: SingBox.run(vpnInterface!!.fileDescriptor)
            
        } catch (e: Exception) {
            Log.e("ProxfierVPN", "Failed to establish VPN", e)
        }
    }

    private fun stopVpn() {
        vpnInterface?.close()
        vpnInterface = null
        stopSelf()
    }

    override fun onDestroy() {
        super.onDestroy()
        stopVpn()
    }
}
