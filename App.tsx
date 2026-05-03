import React, { useState, useReducer } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  FlatList,
} from 'react-native';

interface Task {
  id: string;
  name: string;
  isDone: boolean;
}

interface State {
  tasks: Task[];
}

interface Action {
  type: 'add-new-task' | 'delete-tasks';
  inputValue?: string;
  selectedIds?: string[];
}

const listener = (state: State, action: Action): State => {
  switch (action.type) {
    case 'add-new-task':
      return {
        tasks: [
          ...state.tasks,
          {
            id: `${Date.now()}-${Math.random()}`, 
            name: action.inputValue || '',
            isDone: false,
          },
        ],
      };
    case 'delete-tasks':
      return {
        tasks: state.tasks.filter(
          (task) => !action.selectedIds?.includes(task.id)
        ),
      };
    default:
      return state;
  }
};

export default function App() {
  const [state, dispatch] = useReducer(listener, { tasks: [] });
  const [inputValue, setInputValue] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleAddTask = () => {
    if (!inputValue.trim()) return;
    dispatch({ type: 'add-new-task', inputValue });
    setInputValue('');
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    dispatch({ type: 'delete-tasks', selectedIds });
    setSelectedIds([]);
  };

  return (
    <View style={styles.container}>

      <View style={styles.inline}>
        <TextInput
          style={styles.enter}
          value={inputValue}
          onChangeText={(text) => setInputValue(text)}
          placeholder="Nova tarefa..."
          placeholderTextColor="#aaa"
        />
        <Button title="Adicionar" onPress={handleAddTask} />
      </View>

      {selectedIds.length > 0 && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteSelected}
        >
          <Text style={styles.deleteButtonText}>
            🗑 Excluir {selectedIds.length} tarefa(s)
          </Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={state.tasks}
        keyExtractor={(item) => item.id}
        style={{ width: '80%', marginTop: 10 }}
        renderItem={({ item }) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <TouchableOpacity
              style={[styles.taskItem, isSelected && styles.taskSelected]}
              onPress={() => handleToggleSelect(item.id)}
            >
              <Text style={styles.taskText}>
                {isSelected ? '☑ ' : '☐ '}
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4939BA',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  inline: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'center',
    gap: 8,
  },
  enter: {
    borderColor: '#fff',
    borderWidth: 1,
    backgroundColor: '#5450D6',
    flex: 1,
    color: 'white',
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  taskItem: {
    backgroundColor: '#5450D6',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 8,
  },
  taskSelected: {
    backgroundColor: '#7B2FBE',
    borderColor: '#FFD700',
  },
  taskText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  deleteButton: {
    marginTop: 12,
    backgroundColor: '#C0392B',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
});