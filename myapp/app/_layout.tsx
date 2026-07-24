import { router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Pressable, Text, View } from "react-native";

export default function Layout() {
  const handleLogout = () => {
    router.replace("/");
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => (
          <View
            style={{
              flex: 1,
              backgroundColor: "#ff7a00",
              paddingTop: 50,
              paddingHorizontal: 15,
            }}
          >
            {/* DEFAULT DRAWER ITEMS */}
            {props.state.routes.map((route, index) => {
              if (
                route.name === "index" ||
                route.name === "(tabs)" ||
                route.name === "modal" ||
                route.name === "admin/manage-users" ||
                route.name === "admin/manage-devices"
              ) {
                return null;
              }

              return (
                <Pressable
                  key={index}
                  onPress={() => props.navigation.navigate(route.name)}
                  style={{
                    paddingVertical: 15,
                    paddingHorizontal: 10,
                    marginBottom: 10,
                    borderRadius: 10,
                    backgroundColor: "#ff8c1a",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    {route.name === "dashboard"
                      ? "Home"
                      : route.name === "analytics"
                        ? "Report / Analytics"
                        : route.name === "devices"
                          ? "Device Status"
                          : route.name === "alerts"
                            ? "Alerts / Notifications"
                            : route.name === "map"
                              ? "Map"
                              : route.name === "admin/index"
                                ? "Admin Panel"
                                : route.name === "settings"
                                  ? "Settings"
                                  : route.name}
                  </Text>
                </Pressable>
              );
            })}

            {/* LOGOUT BUTTON */}
            <Pressable
              onPress={handleLogout}
              style={{
                marginTop: "auto",
                marginBottom: 30,
                backgroundColor: "#dcac26",
                padding: 15,
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                Logout
              </Text>
            </Pressable>
          </View>
        )}
        screenOptions={{
          headerShown: false,
          swipeEnabled: true,
          drawerType: "slide",

          drawerStyle: {
            backgroundColor: "#ff7a00",
            width: 260,
          },
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            headerShown: false,
            drawerItemStyle: {
              display: "none",
            },
          }}
        />

        <Drawer.Screen name="dashboard" />
        <Drawer.Screen name="analytics" />
        <Drawer.Screen name="devices" />
        <Drawer.Screen name="alerts" />
        <Drawer.Screen name="map" />

        {/* FIXED HERE */}
        <Drawer.Screen
          name="admin"
          options={{
            title: "Admin Panel",
          }}
        />

        <Drawer.Screen name="settings" />

        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerItemStyle: {
              display: "none",
            },
          }}
        />

        <Drawer.Screen
          name="modal"
          options={{
            drawerItemStyle: {
              display: "none",
            },
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
