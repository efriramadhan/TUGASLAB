import { StyleSheet, Dimensions } from 'react-native';

const window = Dimensions.get('window');

export default StyleSheet.create({
  // Chat List Screen
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#128C7E',
    marginBottom: 20,
  },
  button: {
    padding: 12,
    backgroundColor: '#25D366',
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },

  // Splash Screen
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#128C7E',
  },
  splashLogo: {
  width: 150,
  height: 150,
  resizeMode: 'contain',
  marginBottom: 20,
},
  splashText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  // Login Screen
  loginContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  loginLogo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#128C7E',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#25D366',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  registerText: {
    marginTop: 20,
    fontSize: 15,
    color: '#777',
  },
  registerLink: {
    color: '#128C7E',
    fontWeight: 'bold',
  },

  // Register Screen
  registerContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  registerLogo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  registerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#128C7E',
    marginBottom: 30,
  },
  registerButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#25D366',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  loginText: {
    marginTop: 20,
    fontSize: 15,
    color: '#777',
  },
  loginLink: {
    color: '#128C7E',
    fontWeight: 'bold',
  },

  // Chat Detail Screen
  chatDetailContainer: {
    flex: 1,
    backgroundColor: '#ECE5DD',
    padding: 10,
  },
  chatBubble: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '75%',
  },
  myMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#FFF',
    alignSelf: 'flex-start',
  },
  chatText: {
    fontSize: 16,
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
  chatInput: {
    flex: 1,
    height: 45,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#128C7E',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  // Contact Screen
   contactContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contactItem: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  contactAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: 'cover',
    marginRight: 10,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactStatus: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },

  // Status Screen
  statusContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statusAvatar: {
    width: 55,
    height: 55,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#25D366',
  },
  statusInfo: {
    marginLeft: 15,
  },
  statusName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusTime: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },

  // Status Viewer Screen
  statusViewerContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusViewerImage: {
    width: window.width,
    height: window.height,
    resizeMode: 'cover',
  },
  statusViewerHeader: {
    position: 'absolute',
    top: 40,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusAvatar: {
  width: 55,
  height: 55,
  borderRadius: 30,
  borderWidth: 2,
  borderColor: '#25D366',
  resizeMode: 'cover',
  marginRight: 10,
},
  statusViewerName: {
    marginLeft: 10,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusViewerClose: {
    position: 'absolute',
    top: 30,
    right: 20,
  },
  statusViewerCloseText: {
    color: '#fff',
    fontSize: 30,
  },

  // Call Screen
  callContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  callItem: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  callAvatar: {
  width: 50,
  height: 50,
  borderRadius: 25,
  resizeMode: 'cover',
  marginRight: 10,
},
  callInfo: {
    flex: 1,
    marginLeft: 15,
  },
  callName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  callDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  callTime: {
    marginLeft: 5,
    color: '#777',
    fontSize: 14,
  },
  callButton: {
    padding: 10,
  },

  // Profile Screen
  profileContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#128C7E',
    marginBottom: 15,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 120,
    backgroundColor: '#128C7E',
    borderRadius: 20,
    padding: 6,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileTextGroup: {
    marginLeft: 10,
    flex: 1,
  },
  profileLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 3,
  },
  profileInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
  },
  profileValue: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
  },
  profileButton: {
    marginTop: 20,
    backgroundColor: '#25D366',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  profileButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});