import { StyleSheet } from 'react-native';


// Tela Inicial (HomeScreen)

export const homeStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f6fa',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#2f3640',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 15,
    color: '#718093',
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 15,
    marginBottom: 30,
    resizeMode: 'cover',
  },
  buttonContainer: {
    width: '80%',
  }
});



// Lista de Atrações (AttractionsScreen)

export const listStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  listPadding: {
    padding: 15,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 10,
    marginBottom: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, 
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 35, 
    marginRight: 15,
  },
  infoContainer: {
    flex: 1, 
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2f3640',
    marginBottom: 4,
  },
  neighborhood: {
    fontSize: 14,
    color: '#7f8fa6',
  }
});


// Tela de Detalhes (DetailsScreen)

export const detailsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  imageScroll: {
    height: 250,
  },
  image: {
    width: 320,
    height: 250,
    marginRight: 2,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  neighborhood: {
    fontSize: 16,
    color: '#636e72',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
    color: '#2d3436',
  },
  description: {
    fontSize: 16,
    color: '#2d3436',
    lineHeight: 24,
  },
  info: {
    fontSize: 16,
    color: '#636e72',
    marginBottom: 5,
    lineHeight: 22,
  },
  buttonsContainer: {
    marginTop: 25,
  },
  space: {
    height: 12,
  },
  reservationBox: {
    marginTop: 25,
    padding: 15,
    backgroundColor: '#ffeaa7',
    borderRadius: 8,
  },
  reservationText: {
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#d63031'
  },
  interestBox: {
    marginTop: 30,
    marginBottom: 40, 
  }
});


// Tela de Interesses (InterestScreen)

export const interestStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  listPadding: { padding: 15 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 16, color: '#7f8fa6', textAlign: 'center' },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 10,
    marginBottom: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  thumbnail: { width: 70, height: 70, borderRadius: 35, marginRight: 15 },
  infoContainer: { flex: 1, justifyContent: 'center' },
  name: { fontSize: 18, fontWeight: 'bold', color: '#2f3640', marginBottom: 4 },
  neighborhood: { fontSize: 14, color: '#7f8fa6', marginBottom: 8 },
  removeBtn: { alignSelf: 'flex-start', backgroundColor: '#ff7675', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 },
  removeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' }
});


// Tela de Passes (PassesScreen)

export const passesStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa', padding: 20 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#2d3436', marginBottom: 15 },
  buyCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  passName: { fontSize: 18, fontWeight: 'bold', color: '#2d3436' },
  passDetails: { fontSize: 14, color: '#636e72', marginVertical: 4 },
  passPrice: { fontSize: 16, fontWeight: 'bold', color: '#0984e3' },
  buyBtn: { backgroundColor: '#00b894', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  buyBtnText: { color: '#fff', fontWeight: 'bold' },
  myPassCard: {
    flexDirection: 'row',
    backgroundColor: '#dfe6e9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  myPassName: { fontSize: 16, fontWeight: 'bold', color: '#2d3436' },
  myPassDate: { fontSize: 13, color: '#636e72' },
  statusBadge: { backgroundColor: '#b2bec3', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 5 },
  statusText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: '#b2bec3', marginTop: 20 }
});