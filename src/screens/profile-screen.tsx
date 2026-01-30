import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants';

export default function ProfileScreen() {
  const menuItems = [
    { id: '1', icon: 'bookmark', title: 'Phim đã lưu', subtitle: 'Xem lại các phim bạn đã lưu' },
    { id: '2', icon: 'time', title: 'Lịch sử xem', subtitle: 'Các phim bạn đã xem gần đây' },
    { id: '3', icon: 'notifications', title: 'Thông báo', subtitle: 'Quản lý thông báo' },
    { id: '4', icon: 'settings', title: 'Cài đặt', subtitle: 'Tùy chỉnh ứng dụng' },
    { id: '5', icon: 'information-circle', title: 'Giới thiệu', subtitle: 'Thông tin về ứng dụng' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={40} color={Colors.text} />
          </View>
          <Text style={styles.userName}>Người dùng</Text>
          <Text style={styles.userEmail}>Chưa đăng nhập</Text>
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name={item.icon as any} size={24} color={Colors.primary} />
              </View>
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
                <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.version}>Phiên bản 1.0.0</Text>
        <Text style={styles.copyright}>© 2026 W2W Movies</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  menuContainer: {
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.secondary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  footer: {
    alignItems: 'center',
    padding: 32,
  },
  version: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  copyright: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
