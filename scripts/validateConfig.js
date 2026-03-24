#!/usr/bin/env node

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🔍 GAME CONFIG VALIDATOR
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This script validates the gameConfig.ts file to ensure all required fields
 * are properly configured and that all required assets exist.
 * 
 * Usage:
 *   npm run validate
 *   node scripts/validateConfig.js
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const assetsDir = path.join(projectRoot, 'assets');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Required asset files
const REQUIRED_ASSETS = [
  'icon.png',
  'adaptive-icon.png',
  'splash-icon.png',
  'homeScreenImg.png',
  'favicon.png',
  'notification-icon.png',
  'icons8-settings-100.png',
  'icons8-share-100.png',
  'icons8-rating-100.png',
  'icons8-checkbox-100.png',
  'icons8-unchecked-checkbox-100.png',
];

let errors = [];
let warnings = [];
let infos = [];

function error(message) {
  errors.push(message);
  console.error(`${colors.red}❌ ERROR: ${message}${colors.reset}`);
}

function warn(message) {
  warnings.push(message);
  console.warn(`${colors.yellow}⚠️  WARNING: ${message}${colors.reset}`);
}

function info(message) {
  infos.push(message);
  console.log(`${colors.blue}ℹ️  INFO: ${message}${colors.reset}`);
}

function success(message) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
}

function header(message) {
  console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}${message}${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════════${colors.reset}\n`);
}

// Read and parse gameConfig.ts
function loadGameConfig() {
  const configPath = path.join(projectRoot, 'src', 'core', 'constants', 'gameConfig.ts');
  
  if (!fs.existsSync(configPath)) {
    error('gameConfig.ts not found!');
    return null;
  }

  try {
    const content = fs.readFileSync(configPath, 'utf8');
    
    // Extract the gameConfig object (simple regex-based parsing)
    // This is not perfect but works for our use case
    const configMatch = content.match(/export const gameConfig[^=]*=\s*({[\s\S]*?});/);
    if (!configMatch) {
      error('Could not find gameConfig export in gameConfig.ts');
      return null;
    }

    return content; // Return raw content for regex matching
  } catch (err) {
    error(`Failed to read gameConfig.ts: ${err.message}`);
    return null;
  }
}

// Extract a string value from config content
function extractValue(content, pattern) {
  const match = content.match(pattern);
  return match ? match[1].replace(/['"`]/g, '').trim() : null;
}

// Validate app identity
function validateAppIdentity(content) {
  header('📱 Validating App Identity');

  const id = extractValue(content, /id:\s*['"`]([^'"`]+)['"`]/);
  const name = extractValue(content, /name:\s*['"`]([^'"`]+)['"`]/);
  const version = extractValue(content, /version:\s*['"`]([^'"`]+)['"`]/);
  const bundleIdIOS = extractValue(content, /bundleIdIOS:\s*['"`]([^'"`]+)['"`]/);
  const bundleIdAndroid = extractValue(content, /bundleIdAndroid:\s*['"`]([^'"`]+)['"`]/);

  if (!id) error('App ID is missing or empty');
  else success(`App ID: ${id}`);

  if (!name) error('App name is missing or empty');
  else success(`App Name: ${name}`);

  if (!version) error('Version is missing or empty');
  else success(`Version: ${version}`);

  if (!bundleIdIOS || bundleIdIOS.includes('com.example')) {
    error('iOS Bundle ID is missing or contains placeholder values');
  } else {
    success(`iOS Bundle ID: ${bundleIdIOS}`);
  }

  if (!bundleIdAndroid || bundleIdAndroid.includes('com.example')) {
    error('Android Bundle ID is missing or contains placeholder values');
  } else {
    success(`Android Bundle ID: ${bundleIdAndroid}`);
  }
}

// Validate URLs
function validateURLs(content) {
  header('🔗 Validating URLs');

  const privacyUrl = extractValue(content, /privacyPolicy:\s*['"`]([^'"`]+)['"`]/);
  const termsUrl = extractValue(content, /terms:\s*['"`]([^'"`]+)['"`]/);
  const appStoreUrl = extractValue(content, /appStore:\s*['"`]([^'"`]+)['"`]/);
  const playStoreUrl = extractValue(content, /playStore:\s*['"`]([^'"`]+)['"`]/);

  function isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  if (!privacyUrl || !isValidUrl(privacyUrl)) {
    error('Privacy Policy URL is missing or invalid');
  } else {
    success(`Privacy Policy: ${privacyUrl}`);
  }

  if (!termsUrl || !isValidUrl(termsUrl)) {
    error('Terms URL is missing or invalid');
  } else {
    success(`Terms: ${termsUrl}`);
  }

  if (!appStoreUrl || !isValidUrl(appStoreUrl)) {
    warn('App Store URL is missing or invalid (update after publishing to App Store)');
  } else if (appStoreUrl.includes('id123456789')) {
    warn('App Store URL contains placeholder - update after publishing');
  } else {
    success(`App Store: ${appStoreUrl}`);
  }

  if (!playStoreUrl || !isValidUrl(playStoreUrl)) {
    error('Play Store URL is missing or invalid');
  } else {
    success(`Play Store: ${playStoreUrl}`);
  }
}

// Validate assets
function validateAssets() {
  header('🖼️  Validating Assets');

  if (!fs.existsSync(assetsDir)) {
    error(`Assets directory not found: ${assetsDir}`);
    return;
  }

  const existingAssets = fs.readdirSync(assetsDir);

  REQUIRED_ASSETS.forEach((asset) => {
    const assetPath = path.join(assetsDir, asset);
    if (!fs.existsSync(assetPath)) {
      error(`Missing required asset: ${asset}`);
    } else {
      const stats = fs.statSync(assetPath);
      if (stats.size === 0) {
        error(`Asset file is empty: ${asset}`);
      } else {
        success(`Found: ${asset} (${(stats.size / 1024).toFixed(1)} KB)`);
      }
    }
  });

  // Check for unexpected files
  const knownAssets = [...REQUIRED_ASSETS];
  existingAssets.forEach((file) => {
    if (!knownAssets.includes(file) && !file.startsWith('.')) {
      info(`Additional asset found: ${file}`);
    }
  });
}

// Validate theme colors
function validateTheme(content) {
  header('🎨 Validating Theme Colors');

  const colorPattern = /#[0-9A-Fa-f]{3,8}/g;
  const colorMatches = content.match(colorPattern);

  if (!colorMatches || colorMatches.length < 15) {
    warn('Theme section may be incomplete (expected at least 15 color values)');
  } else {
    success(`Found ${colorMatches.length} color values in theme configuration`);
  }

  // Check for common color values that should be customized
  if (content.includes('#E8D4B8') && content.includes('#F5A623')) {
    info('Theme colors appear to match Travel Town defaults - consider customizing for your game');
  }
}

// Validate reward types
function validateRewardTypes(content) {
  header('🎁 Validating Reward Types');

  const rewardsMatch = content.match(/rewards:\s*{([\s\S]*?)},\s*\/\//);
  if (!rewardsMatch) {
    error('Reward types configuration not found');
    return;
  }

  const rewardsContent = rewardsMatch[1];
  const rewardTypeMatches = rewardsContent.match(/(\w+):\s*{/g);

  if (!rewardTypeMatches || rewardTypeMatches.length === 0) {
    error('No reward types defined');
  } else {
    const rewardTypes = rewardTypeMatches.map((m) => m.replace(/:\s*{/, '').trim());
    success(`Found ${rewardTypes.length} reward type(s): ${rewardTypes.join(', ')}`);
  }
}

// Validate AdMob configuration
function validateAdMob(content) {
  header('💰 Validating AdMob Configuration');

  const androidAppId = extractValue(content, /androidAppId:\s*['"`]([^'"`]+)['"`]/);
  const iosAppId = extractValue(content, /iosAppId:\s*['"`]([^'"`]+)['"`]/);

  if (!androidAppId || androidAppId.includes('XXXX')) {
    warn('Android AdMob App ID contains placeholder - update with your real AdMob ID');
  } else if (androidAppId.startsWith('ca-app-pub-')) {
    success(`Android AdMob ID: ${androidAppId}`);
  } else {
    error('Android AdMob ID format is invalid');
  }

  if (!iosAppId || iosAppId.includes('XXXX')) {
    warn('iOS AdMob App ID contains placeholder - update with your real AdMob ID');
  } else if (iosAppId.startsWith('ca-app-pub-')) {
    success(`iOS AdMob ID: ${iosAppId}`);
  } else {
    error('iOS AdMob ID format is invalid');
  }
}

// Main validation
function main() {
  console.log(`\n${colors.magenta}╔═══════════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.magenta}║                  GAME CONFIG VALIDATOR                            ║${colors.reset}`);
  console.log(`${colors.magenta}╚═══════════════════════════════════════════════════════════════════╝${colors.reset}\n`);

  const content = loadGameConfig();
  if (!content) {
    console.log(`\n${colors.red}Validation failed: Could not load gameConfig.ts${colors.reset}\n`);
    process.exit(1);
  }

  validateAppIdentity(content);
  validateURLs(content);
  validateAssets();
  validateTheme(content);
  validateRewardTypes(content);
  validateAdMob(content);

  // Summary
  header('📊 Validation Summary');

  if (errors.length > 0) {
    console.log(`${colors.red}❌ ${errors.length} ERROR(S) FOUND${colors.reset}`);
    errors.forEach((err, i) => console.log(`   ${i + 1}. ${err}`));
  }

  if (warnings.length > 0) {
    console.log(`${colors.yellow}⚠️  ${warnings.length} WARNING(S)${colors.reset}`);
    warnings.forEach((warn, i) => console.log(`   ${i + 1}. ${warn}`));
  }

  if (infos.length > 0) {
    console.log(`${colors.blue}ℹ️  ${infos.length} INFO MESSAGE(S)${colors.reset}`);
  }

  console.log('');

  if (errors.length === 0) {
    console.log(`${colors.green}╔═══════════════════════════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.green}║                   ✅ VALIDATION PASSED!                           ║${colors.reset}`);
    console.log(`${colors.green}╚═══════════════════════════════════════════════════════════════════╝${colors.reset}\n`);
    
    if (warnings.length > 0) {
      console.log(`${colors.yellow}Note: Please review the warnings above.${colors.reset}\n`);
    }
    
    process.exit(0);
  } else {
    console.log(`${colors.red}╔═══════════════════════════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.red}║                   ❌ VALIDATION FAILED!                           ║${colors.reset}`);
    console.log(`${colors.red}╚═══════════════════════════════════════════════════════════════════╝${colors.reset}\n`);
    console.log(`${colors.red}Please fix the errors above before building.${colors.reset}\n`);
    process.exit(1);
  }
}

main();
