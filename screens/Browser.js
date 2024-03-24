import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Browser = () => {
  const navigation = useNavigation();
  const [tabs, setTabs] = useState([
    { id: 1, url: 'https://www.google.com', title: 'Home' },
  ]);
  const [activeTabId, setActiveTabId] = useState(1);
  const webViewRefs = useRef({});
  
  const [urlInputs, setUrlInputs] = useState({'1': 'https://www.google.com'});
  
  const addNewTab = () => {
    const newTabId = tabs.length + 1;
    setTabs([...tabs, { id: newTabId, url: 'https://www.google.com', title: 'New Tab' }]);
    setActiveTabId(newTabId);
    setUrlInputs({...urlInputs, [newTabId]: 'https://www.google.com'});
  };

  const closeTab = (tabId) => {
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);
    const {[tabId]: value, ...remainingUrlInputs} = urlInputs;
    setUrlInputs(remainingUrlInputs);
    if (newTabs.length > 0) {
      setActiveTabId(newTabs[0].id);
    } else {
      setActiveTabId(null);
    }
  };

  const changeTab = (tabId) => {
    setActiveTabId(tabId);
  };

  const handleNavigationChange = (newNavState, tabId) => {
    const updatedTabs = tabs.map(tab =>
      tab.id === tabId ? { ...tab, title: newNavState.title || tab.title } : tab
    );
    setTabs(updatedTabs);
  };

  const updateUrlInput = (text, tabId) => {
    setUrlInputs({...urlInputs, [tabId]: text});
  };

  const navigateToUrl = (tabId) => {
    const updatedTabs = tabs.map(tab =>
      tab.id === tabId ? { ...tab, url: urlInputs[tabId] } : tab
    );
    setTabs(updatedTabs);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabsBar}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContentContainer}
        >
          <TouchableOpacity
              style={styles.headerBox}
              onPress={() => navigation.goBack()}
            >
              <AntDesign name="leftcircle" size={22} color="white" />
            </TouchableOpacity>
          {tabs.map((tab) => (
            <View key={tab.id} style={styles.tab}>
              <TouchableOpacity
                style={styles.tabButton}
                onPress={() => changeTab(tab.id)}
              >
                <Text style={styles.tabButtonText}>{tab.title}</Text>
              </TouchableOpacity>
              {tabs.length > 1 && (
                <TouchableOpacity
                  style={styles.closeTabButton}
                  onPress={() => closeTab(tab.id)}
                >
                  <Text style={styles.closeTabButtonText}>×</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity onPress={addNewTab} style={styles.addTabButton}>
            <Text style={styles.addTabButtonText}>+</Text>
          </TouchableOpacity>
        </ScrollView>
        {tabs.map((tab) => (
          <TextInput
            key={`urlInput_${tab.id}`}
            style={[styles.urlInput, activeTabId === tab.id ? {} : styles.hidden]}
            onChangeText={(text) => updateUrlInput(text, tab.id)}
            value={urlInputs[tab.id]}
            placeholder="Enter URL"
            placeholderTextColor='gray'
            onSubmitEditing={() => navigateToUrl(tab.id)}
          />
        ))}
      </View>
      {tabs.map((tab) => (
        <WebView
          key={tab.id}
          source={{ uri: tab.url }}
          style={[styles.webView, activeTabId === tab.id ? {} : styles.hidden]}
          ref={(ref) => (webViewRefs.current[tab.id] = ref)}
          onNavigationStateChange={(newNavState) =>
            handleNavigationChange(newNavState, tab.id)
          }
        />
      ))}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    backgroundColor: '#4CAF50',
  },
  tabsContentContainer: {
    alignItems: 'center',
  },
  headerBox: {
    marginRight: 10,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    marginRight: 8,
  },
  tabButtonText: {
    color: '#FFFFFF',
  },
  closeTabButton: {
    position: 'absolute', 
    right: 5, 
    top: -5, 
    width: 20, 
    height: 20, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  closeTabButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  addTabButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  addTabButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  webView: {
    flex: 1,
  },
  activeWebView: {
    display: 'flex',
  },
  hiddenWebView: {
    display: 'none',
  },
  urlInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#fff',
    padding: 8,
    borderRadius: 5,
    color: '#fff',
    margin: 8,
  },
  tabsBar: {
    backgroundColor: 'green',
  },
  hidden: {
    display: 'none',
  },

});

export default Browser;
