/**
 * LernDeutsch AI - Network Status Hook
 * Monitors device connectivity and provides an easy-to-use isOnline flag.
 *
 * Usage:
 *   const { isOnline, connectionType } = useNetworkStatus();
 *
 * NOTE: Requires @react-native-community/netinfo to be installed.
 * If not installed, this hook will default to "online" to avoid
 * blocking the user.
 */

import { useState, useEffect } from "react";

// We'll try to import NetInfo dynamically to avoid build errors
// if the package isn't installed yet.
let NetInfo: any = null;
try {
    NetInfo = require("@react-native-community/netinfo").default;
} catch {
    // Package not installed — hook will default to online
}

interface NetworkState {
    isOnline: boolean;
    connectionType: string | null;
}

export const useNetworkStatus = (): NetworkState => {
    const [state, setState] = useState<NetworkState>({
        isOnline: true, // assume online until proven otherwise
        connectionType: null,
    });

    useEffect(() => {
        if (!NetInfo) {
            // Package not available — stay with defaults
            return;
        }

        const unsubscribe = NetInfo.addEventListener((netState: any) => {
            setState({
                isOnline: netState.isConnected ?? true,
                connectionType: netState.type ?? null,
            });
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return state;
};
