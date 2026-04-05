import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, Alert,
  ScrollView, TextInput, Modal, StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { passesStyles as styles, btn } from '../styles/styles';

// Tipos de passe vêm de JSON externo 
import PASS_TYPES from '../data/passes.json';

const STORAGE_KEY = '@meus_passes';

// Helpers de data: calcula validade, formata pra pt-BR e verifica se ainda está ativo
const addDays    = (date, days) => { const d = new Date(date); d.setDate(d.getDate() + days); return d; };
const formatDate = (date) => new Date(date).toLocaleDateString('pt-BR');
const getStatus  = (expiresAt) => new Date(expiresAt) >= new Date() ? 'Ativo' : 'Expirado';

// Estilos exclusivos do BuyModal — ficam no topo junto com as outras constantes
const m = StyleSheet.create({
  overlay:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  box:        { backgroundColor: '#fff', borderRadius: 16, padding: 24 },
  passInfo:   { fontSize: 13, color: '#0984e3', fontWeight: 'bold', marginBottom: 16 },
  title:      { fontSize: 18, fontWeight: 'bold', color: '#2d3436', marginBottom: 20 },
  radioRow:   { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  radioOuter: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#0984e3', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  radioInner: { width: 11, height: 11, borderRadius: 6, backgroundColor: '#0984e3' },
  radioLabel: { fontSize: 16, color: '#2d3436' },
  label:      { fontSize: 14, fontWeight: 'bold', color: '#2d3436', marginBottom: 6 },
  input:      { borderWidth: 1, borderColor: '#dfe6e9', borderRadius: 8, padding: 12, fontSize: 15, marginBottom: 16, color: '#2d3436' },
  confirmBtn: { backgroundColor: '#00b894', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8, marginBottom: 10 },
  confirmText:{ color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelBtn:  { alignItems: 'center', padding: 10 },
  cancelText: { color: '#636e72', fontSize: 15 },
});

// React Native não tem radio button nativo: simulamos com dois círculos concêntricos
function RadioOption({ label, selected, onPress }) {
  return (
    <TouchableOpacity style={m.radioRow} onPress={onPress} activeOpacity={0.7}>
      <View style={m.radioOuter}>{selected && <View style={m.radioInner} />}</View>
      <Text style={m.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

// Modal de compra em 2 passos: primeiro pergunta pra quem é, depois coleta nome/e-mail se for pra outra pessoa
function BuyModal({ visible, pass, onClose, onPurchase }) {
  const [step,       setStep]       = useState('who');
  const [recipient,  setRecipient]  = useState('me');
  const [otherName,  setOtherName]  = useState('');
  const [otherEmail, setOtherEmail] = useState('');

  // Reseta os campos ao abrir (sem isso os dados da compra anterior ficam preenchidos)
  const reset = () => { setStep('who'); setRecipient('me'); setOtherName(''); setOtherEmail(''); };
  useFocusEffect(useCallback(reset, [visible]));

  const handleNext = () => {
    if (step === 'who') {
      if (recipient === 'me') return onPurchase('Você', null);
      setStep('other');
    } else {
      if (!otherName.trim()) return Alert.alert('Atenção', 'Informe o nome.');
      if (!otherEmail.trim() || !otherEmail.includes('@')) return Alert.alert('Atenção', 'E-mail inválido.');
      onPurchase(otherName.trim(), otherEmail.trim());
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={m.overlay}>
        <View style={m.box}>
          {pass && (
            <Text style={m.passInfo}>
              Passe {pass.name} · R$ {pass.price},00 · {pass.days} dias
            </Text>
          )}

          <Text style={m.title}>
            {step === 'who' ? 'Para quem é o passe?' : 'Dados do beneficiário'}
          </Text>

          {step === 'who' ? (
            <>
              <RadioOption label="Para mim"          selected={recipient === 'me'}    onPress={() => setRecipient('me')} />
              <RadioOption label="Para outra pessoa"  selected={recipient === 'other'} onPress={() => setRecipient('other')} />
            </>
          ) : (
            <>
              <Text style={m.label}>Nome</Text>
              <TextInput style={m.input} placeholder="Nome completo"     value={otherName}  onChangeText={setOtherName} />
              <Text style={m.label}>E-mail</Text>
              <TextInput style={m.input} placeholder="email@exemplo.com" value={otherEmail} onChangeText={setOtherEmail}
                keyboardType="email-address" autoCapitalize="none" />
            </>
          )}

          <TouchableOpacity style={m.confirmBtn} onPress={handleNext}>
            <Text style={m.confirmText}>
              {step === 'who' && recipient === 'me' ? 'Confirmar Compra' : step === 'who' ? 'Próximo →' : 'Confirmar Compra'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={m.cancelBtn} onPress={step === 'who' ? onClose : () => setStep('who')}>
            <Text style={m.cancelText}>{step === 'who' ? 'Cancelar' : '← Voltar'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default function PassesScreen() {
  const [myPasses,     setMyPasses]     = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPass, setSelectedPass] = useState(null);

  // Recarrega os passes toda vez que abre a tela (garante que compras de sessões anteriores apareçam)
  useFocusEffect(useCallback(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(raw => raw && setMyPasses(JSON.parse(raw)))
      .catch(e  => console.error('Erro ao carregar passes:', e));
  }, []));

  const openBuyModal = (pass) => { setSelectedPass(pass); setModalVisible(true); };

  // id via Date.now() garante unicidade sem precisar de biblioteca externa
  const finalizePurchase = async (beneficiary, email) => {
    const now       = new Date();
    const expiresAt = addDays(now, selectedPass.days);
    const newPass   = {
      id: Date.now().toString(), passName: selectedPass.name,
      beneficiary, email,
      purchasedAt: now.toISOString(), expiresAt: expiresAt.toISOString(),
      price: selectedPass.price, attractions: selectedPass.attractions,
    };
    try {
      const updated = [newPass, ...myPasses]; // mais recente primeiro
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setMyPasses(updated);
      setModalVisible(false);
      Alert.alert('Compra Realizada!',
        `Passe ${selectedPass.name} adquirido para ${beneficiary}.\nVálido até ${formatDate(expiresAt)}.`);
    } catch {
      Alert.alert('Erro', 'Não foi possível processar a compra.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Adquirir Novo Passe</Text>

      {PASS_TYPES.map(item => (
        <View key={item.id} style={styles.buyCard}>
          <View>
            <Text style={styles.passName}>Passe {item.name}</Text>
            <Text style={styles.passDetails}>{item.attractions} atrações • {item.days} dias</Text>
            <Text style={styles.passPrice}>R$ {item.price},00</Text>
          </View>
          <TouchableOpacity style={styles.buyBtn} onPress={() => openBuyModal(item)}>
            <Text style={styles.buyBtnText}>Comprar</Text>
          </TouchableOpacity>
        </View>
      ))}

      <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Meus Passes</Text>

      {/* Passes expirados continuam visíveis, só muda a cor do badge */}
      {myPasses.length === 0 ? (
        <Text style={styles.emptyText}>Você ainda não possui passes adquiridos.</Text>
      ) : myPasses.map(item => {
        const status   = getStatus(item.expiresAt);
        const isActive = status === 'Ativo';
        return (
          <View key={item.id} style={styles.myPassCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.myPassName}>FloriPasse {item.passName}</Text>
              <Text style={styles.myPassDate}>Para: {item.beneficiary}</Text>
              {item.email && <Text style={styles.myPassDate}>E-mail: {item.email}</Text>}
              <Text style={styles.myPassDate}>Comprado em: {formatDate(item.purchasedAt)}</Text>
              <Text style={styles.myPassDate}>Válido até: {formatDate(item.expiresAt)}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: isActive ? '#00b894' : '#b2bec3' }]}>
              <Text style={styles.statusText}>{status}</Text>
            </View>
          </View>
        );
      })}

      <View style={{ height: 40 }} />

      <BuyModal
        visible={modalVisible}
        pass={selectedPass}
        onClose={() => setModalVisible(false)}
        onPurchase={finalizePurchase}
      />
    </ScrollView>
  );
}

