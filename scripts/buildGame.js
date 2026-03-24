#!/usr/bin/env node

/**
 * Build Game Script
 * 
 * Updates app.json and package.json with values from gameConfig.ts
 * Run this after modifying gameConfig to sync build configuration files.
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function loadGameConfig() {
  const configPath = path.resolve(__dirname, '../src/core/constants/gameConfig.ts');
  
  if (!fs.existsSync(configPath)) {
    log('❌ Error: gameConfig.ts not found', 'red');
    process.exit(1);
  }

  const configContent = fs.readFileSync(configPath, 'utf8');
  
  // Find ONLY the gameConfig object (not the interface)
  // Start from "export const gameConfig: GameConfig = {"
  const gameConfigStart = configContent.indexOf('export const gameConfig: GameConfig = {');
  
  if (gameConfigStart === -1) {
    log('❌ Error: Could not find gameConfig object', 'red');
    process.exit(1);
  }

  // Get content starting from gameConfig definition
  const gameConfigContent = configContent.substring(gameConfigStart);
  
  // Extract values from the gameConfig object
  const config = {
    appName: extractNestedValue(gameConfigContent, 'app', 'name'),
    appId: extractNestedValue(gameConfigContent, 'app', 'id'),
    version: extractNestedValue(gameConfigContent, 'app', 'version'),
    slug: extractNestedValue(gameConfigContent, 'app', 'slug'),
    iosBundleId: extractNestedValue(gameConfigContent, 'app', 'bundleIdIOS'),
    androidPackage: extractNestedValue(gameConfigContent, 'app', 'bundleIdAndroid'),
    splashBackground: extractNestedValue(gameConfigContent, 'theme', 'splashBackgroundColor'),
    androidAdMobAppId: extractNestedValue(gameConfigContent, 'admob', 'androidAppId'),
    iosAdMobAppId: extractNestedValue(gameConfigContent, 'admob', 'iosAppId'),
    notificationChannelId: extractNestedValue(gameConfigContent, 'firebase', 'notificationChannelId'),
  };

  return config;
}

function extractNestedValue(content, section, key) {
  // Simpler approach: look for the pattern anywhere in the file after gameConfig definition
  // Find "section: { ... key: 'value', ... }"
  
  // First, find the start of the section
  const sectionStartRegex = new RegExp(`${section}:\\s*\\{`, 'g');
  const sectionMatch = sectionStartRegex.exec(content);
  
  if (!sectionMatch) {
    log(`⚠️  Warning: Could not find section ${section}`, 'yellow');
    return null;
  }

  // Get content starting from the section
  const fromSection = content.substring(sectionMatch.index);
  
  // Find the key within a reasonable distance (next 1000 chars)
  const searchArea = fromSection.substring(0, 1000);
  
  // Find the key-value pair - handle both string literals
  const valueRegex = new RegExp(`${key}:\\s*['"]([^'"]+)['"]`);
  const match = searchArea.match(valueRegex);
  
  if (!match) {
    log(`⚠️  Warning: Could not find ${key} in ${section}`, 'yellow');
    return null;
  }

  return match[1];
}

function updateAppJson(config) {
  const appJsonPath = path.resolve(__dirname, '../app.json');
  
  if (!fs.existsSync(appJsonPath)) {
    log('❌ Error: app.json not found', 'red');
    process.exit(1);
  }

  const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));

  // Update values
  if (config.appName) appJson.expo.name = config.appName;
  if (config.slug) appJson.expo.slug = config.slug;
  if (config.version) appJson.expo.version = config.version;
  if (config.splashBackground) {
    appJson.expo.splash.backgroundColor = config.splashBackground;
    appJson.expo.android.adaptiveIcon.backgroundColor = config.splashBackground;
  }
  if (config.iosBundleId) appJson.expo.ios.bundleIdentifier = config.iosBundleId;
  if (config.androidPackage) appJson.expo.android.package = config.androidPackage;

  // Update AdMob app IDs in plugins
  const adMobPluginIndex = appJson.expo.plugins.findIndex(
    plugin => Array.isArray(plugin) && plugin[0] === 'react-native-google-mobile-ads'
  );

  if (adMobPluginIndex !== -1) {
    if (config.androidAdMobAppId) {
      appJson.expo.plugins[adMobPluginIndex][1].androidAppId = config.androidAdMobAppId;
    }
    if (config.iosAdMobAppId) {
      appJson.expo.plugins[adMobPluginIndex][1].iosAppId = config.iosAdMobAppId;
    }
  }

  // Update Firebase notification channel ID
  const firebaseMessagingIndex = appJson.expo.plugins.findIndex(
    plugin => Array.isArray(plugin) && plugin[0] === '@react-native-firebase/messaging'
  );

  if (firebaseMessagingIndex !== -1 && config.notificationChannelId) {
    appJson.expo.plugins[firebaseMessagingIndex][1].default_notification_channel_id = config.notificationChannelId;
  }

  // Write back to file with proper formatting
  fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + '\n', 'utf8');
  
  log('✅ Updated app.json', 'green');
}

function updatePackageJson(config) {
  const packageJsonPath = path.resolve(__dirname, '../package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    log('❌ Error: package.json not found', 'red');
    process.exit(1);
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  // Update version
  if (config.version) {
    packageJson.version = config.version;
  }

  // Write back to file with proper formatting
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8');
  
  log('✅ Updated package.json', 'green');
}

function main() {
  log('\n🚀 Building game configuration...\n', 'cyan');

  try {
    const config = loadGameConfig();
    
    log('📋 Configuration loaded:', 'blue');
    log(`   App Name: ${config.appName || 'N/A'}`, 'blue');
    log(`   Version: ${config.version || 'N/A'}`, 'blue');
    log(`   iOS Bundle ID: ${config.iosBundleId || 'N/A'}`, 'blue');
    log(`   Android Package: ${config.androidPackage || 'N/A'}\n`, 'blue');

    // Check if we got valid config values
    if (!config.appName || !config.version || !config.iosBundleId || !config.androidPackage) {
      log('⚠️  WARNING: Some configuration values could not be extracted.', 'yellow');
      log('⚠️  This might be because gameConfig uses dynamic values or has a different structure.', 'yellow');
      log('⚠️  Proceeding with available values...\n', 'yellow');
    }

    updateAppJson(config);
    updatePackageJson(config);

    log('\n✨ Build configuration updated successfully!', 'green');
    log('📝 Next steps:', 'cyan');
    log('   1. Replace assets in assets/ folder', 'cyan');
    log('   2. Update google-services.json (Android)', 'cyan');
    log('   3. Update GoogleService-Info.plist (iOS)', 'cyan');
    log('   4. Run: npm run validate to verify configuration\n', 'cyan');

  } catch (error) {
    log(`\n❌ Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

main();
