/**
 * PassesScreen.js
 *
 * FLUXO DE COMPRA (modal em 2 etapas):
 *
 * Etapa 1 — "Para quem é o passe?"
 *   • Para mim       → confirma direto, pula etapa 2
 *   • Para outra pessoa → vai para etapa 2
 *
 * Etapa 2 — Dados da outra pessoa
 *   • Nome + e-mail → confirma a compra
 *
 * CONCEITOS DE ESTADO USADOS:
 *   - modalStep: controla qual etapa está visível ('who' | 'other')
 *   - recipient: 'me' | 'other' — seleção das bolinhas (radio)
 *   - otherName / otherEmail: campos da etapa 2
 */

import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, Alert,
  ScrollView, TextInput, Modal, StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { passesStyles as styles } from './styles';

const PASS_TYPES = [
  { id: '1', name: 'Básico',  attractions: 3, days: 3, price: 89  },
  { id: '2', name: 'Plus',    attractions: 5, days: 5, price: 149 },
  { id: '3', name: 'Top',     attractions: 7, days: 7, price: 199 },
];

const STORAGE_KEY = '@meus_passes';

// ── Utilitários de data ───────────────────────
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('pt-BR');
}

function getStatus(expiresAt) {
  return new Date(expiresAt) >= new Date() ? 'Ativo' : 'Expirado';
}

// ── Componente de radio button ────────────────
/**
 * RadioOption — bolinha de seleção com label.
 * Props:
 *   label    → texto exibido ao lado
 *   selected → bool, se esta opção está marcada
 *   onPress  → callback ao tocar
 */
function RadioOption({ label, selected, onPress }) {
  return (
    <TouchableOpacity style={m.radioRow} onPress={onPress} activeOpacity={0.7}>
      {/* Círculo externo sempre visível */}
      <View style={m.radioOuter}>
        {/* Círculo interno só aparece quando selecionado */}
        {selected && <View style={m.radioInner} />}
      </View>
      <Text style={m.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

// ── Componente principal ──────────────────────
export default function PassesScreen() {
  const [myPasses, setMyPasses]       = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPass, setSelectedPass] = useState(null);

  // Controla qual etapa do modal está visível:
  //   'who'   → pergunta "para quem?"
  //   'other' → formulário com nome e e-mail
  const [modalStep, setModalStep] = useState('who');

  // 'me' | 'other' — qual bolinha está selecionada
  const [recipient, setRecipient] = useState('me');

  // Campos da etapa 2
  const [otherName,  setOtherName]  = useState('');
  const [otherEmail, setOtherEmail] = useState('');

  // Carrega passes ao focar na tela
  useFocusEffect(
    useCallback(() => { loadPasses(); }, [])
  );

  const loadPasses = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) setMyPasses(JSON.parse(raw));
    } catch (e) {
      console.error('Erro ao carregar passes:', e);
    }
  };

  /** Abre o modal sempre na etapa 1, com "Para mim" pré-selecionado. */
  const openBuyModal = (passType) => {
    setSelectedPass(passType);
    setModalStep('who');
    setRecipient('me');
    setOtherName('');
    setOtherEmail('');
    setModalVisible(true);
  };

  /** Avança da etapa 1 para a etapa 2 (só quando "Para outra pessoa"). */
  const goToNextStep = () => {
    if (recipient === 'me') {
      // "Para mim" — não precisa de mais dados, confirma direto
      finalizePurchase('Você', null);
    } else {
      // "Para outra pessoa" — vai para o formulário
      setModalStep('other');
    }
  };

  /** Etapa 2: valida os campos e confirma. */
  const handleConfirmOther = () => {
    if (!otherName.trim()) {
      Alert.alert('Atenção', 'Informe o nome da pessoa.');
      return;
    }
    if (!otherEmail.trim() || !otherEmail.includes('@')) {
      Alert.alert('Atenção', 'Informe um e-mail válido.');
      return;
    }
    finalizePurchase(otherName.trim(), otherEmail.trim());
  };

  /**
   * Cria o objeto do passe, salva no AsyncStorage e fecha o modal.
   * @param {string} beneficiary - nome de quem vai usar
   * @param {string|null} email  - e-mail (null quando for "Para mim")
   */
  const finalizePurchase = async (beneficiary, email) => {
    const now       = new Date();
    const expiresAt = addDays(now, selectedPass.days);

    const newPass = {
      id:          Date.now().toString(),
      passName:    selectedPass.name,
      beneficiary,
      email,                              // null se for para si mesmo
      purchasedAt: now.toISOString(),
      expiresAt:   expiresAt.toISOString(),
      price:       selectedPass.price,
      attractions: selectedPass.attractions,
    };

    try {
      const updatedList = [newPass, ...myPasses];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      setMyPasses(updatedList);
      setModalVisible(false);
      Alert.alert(
        'Compra Realizada!',
        `Passe ${selectedPass.name} adquirido para ${beneficiary}.\nVálido até ${formatDate(expiresAt)}.`
      );
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível processar a compra.');
    }
  };

  // ── Render ────────────────────────────────────
  return (
    <ScrollView style={styles.container}>

      <Text style={styles.sectionTitle}>Adquirir Novo Passe</Text>

      {PASS_TYPES.map((item) => (
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

      {myPasses.length === 0 ? (
        <Text style={styles.emptyText}>Você ainda não possui passes adquiridos.</Text>
      ) : (
        myPasses.map((item) => {
          const status   = getStatus(item.expiresAt);
          const isActive = status === 'Ativo';
          return (
            <View key={item.id} style={styles.myPassCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.myPassName}>FloriPasse {item.passName}</Text>
                <Text style={styles.myPassDate}>Para: {item.beneficiary}</Text>
                {item.email && (
                  <Text style={styles.myPassDate}>E-mail: {item.email}</Text>
                )}
                <Text style={styles.myPassDate}>Comprado em: {formatDate(item.purchasedAt)}</Text>
                <Text style={styles.myPassDate}>Válido até: {formatDate(item.expiresAt)}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: isActive ? '#00b894' : '#b2bec3' }]}>
                <Text style={styles.statusText}>{status}</Text>
              </View>
            </View>
          );
        })
      )}

      <View style={{ height: 40 }} />

      {/* ── Modal de compra ─────────────────── */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={m.overlay}>
          <View style={m.box}>

            {/* Cabeçalho com info do passe selecionado */}
            {selectedPass && (
              <Text style={m.passInfo}>
                Passe {selectedPass.name} · R$ {selectedPass.price},00 · {selectedPass.days} dias
              </Text>
            )}

            {/* ── Etapa 1: para quem? ── */}
            {modalStep === 'who' && (
              <>
                <Text style={m.title}>Para quem é o passe?</Text>

                <RadioOption
                  label="Para mim"
                  selected={recipient === 'me'}
                  onPress={() => setRecipient('me')}
                />
                <RadioOption
                  label="Para outra pessoa"
                  selected={recipient === 'other'}
                  onPress={() => setRecipient('other')}
                />

                <TouchableOpacity style={m.confirmBtn} onPress={goToNextStep}>
                  <Text style={m.confirmText}>
                    {recipient === 'me' ? 'Confirmar Compra' : 'Próximo →'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={m.cancelBtn} onPress={() => setModalVisible(false)}>
                  <Text style={m.cancelText}>Cancelar</Text>
                </TouchableOpacity>
              </>
            )}

            {/* ── Etapa 2: dados da outra pessoa ── */}
            {modalStep === 'other' && (
              <>
                <Text style={m.title}>Dados do beneficiário</Text>

                <Text style={m.label}>Nome</Text>
                <TextInput
                  style={m.input}
                  placeholder="Nome completo"
                  value={otherName}
                  onChangeText={setOtherName}
                />

                <Text style={m.label}>E-mail</Text>
                <TextInput
                  style={m.input}
                  placeholder="email@exemplo.com"
                  value={otherEmail}
                  onChangeText={setOtherEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <TouchableOpacity style={m.confirmBtn} onPress={handleConfirmOther}>
                  <Text style={m.confirmText}>Confirmar Compra</Text>
                </TouchableOpacity>

                <TouchableOpacity style={m.cancelBtn} onPress={() => setModalStep('who')}>
                  <Text style={m.cancelText}>← Voltar</Text>
                </TouchableOpacity>
              </>
            )}

          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

// ── Estilos do modal e radio ──────────────────
const m = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
  },
  passInfo: {
    fontSize: 13,
    color: '#0984e3',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 20,
  },
  // Radio button
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#0984e3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#0984e3',
  },
  radioLabel: {
    fontSize: 16,
    color: '#2d3436',
  },
  // Campos etapa 2
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 16,
    color: '#2d3436',
  },
  // Botões
  confirmBtn: {
    backgroundColor: '#00b894',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 10,
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelBtn: {
    alignItems: 'center',
    padding: 10,
  },
  cancelText: {
    color: '#636e72',
    fontSize: 15,
  },
});
