#!/usr/bin/env node

/**
 * Computer Audio Control
 * Main entry point for the audio control application
 */

const loudness = require('loudness');

/**
 * Get the current system volume level
 * @returns {Promise<number>} Volume level as a percentage (0-100)
 */
async function getCurrentVolume() {
    try {
        const volume = await loudness.getVolume();
        return volume;
    } catch (error) {
        console.error('Error getting volume level:', error.message);
        throw error;
    }
}

/**
 * Set the system volume level
 * @param {number} volume - Volume level as a percentage (0-100)
 * @returns {Promise<void>}
 */
async function setVolume(volume) {
    try {
        // Ensure volume is within valid range
        const clampedVolume = Math.max(0, Math.min(100, volume));
        await loudness.setVolume(clampedVolume);
    } catch (error) {
        console.error('Error setting volume:', error.message);
        throw error;
    }
}

/**
 * Get system mute status
 * @returns {Promise<boolean>} True if muted, false otherwise
 */
async function getMuteStatus() {
    try {
        const isMuted = await loudness.getMuted();
        return isMuted;
    } catch (error) {
        console.error('Error getting mute status:', error.message);
        throw error;
    }
}

/**
 * Mute the system
 * @returns {Promise<void>}
 */
async function mute() {
    try {
        await loudness.setMuted(true);
    } catch (error) {
        console.error('Error muting system:', error.message);
        throw error;
    }
}

/**
 * Unmute the system
 * @returns {Promise<void>}
 */
async function unmute() {
    try {
        await loudness.setMuted(false);
    } catch (error) {
        console.error('Error unmuting system:', error.message);
        throw error;
    }
}

/**
 * Increase volume by 10%
 * @returns {Promise<void>}
 */
async function increaseVolume() {
    try {
        const currentVolume = await loudness.getVolume();
        const newVolume = Math.min(100, currentVolume + 10);
        await loudness.setVolume(newVolume);
    } catch (error) {
        console.error('Error increasing volume:', error.message);
        throw error;
    }
}

/**
 * Decrease volume by 10%
 * @returns {Promise<void>}
 */
async function decreaseVolume() {
    try {
        const currentVolume = await loudness.getVolume();
        const newVolume = Math.max(0, currentVolume - 10);
        await loudness.setVolume(newVolume);
    } catch (error) {
        console.error('Error decreasing volume:', error.message);
        throw error;
    }
}

async function main() {
    console.log('Audio control application initialized');
    
    try {
        // Example usage: Get current volume
        const currentVolume = await getCurrentVolume();
        console.log(`Current volume: ${currentVolume}%`);
        
        // Example usage: Get mute status
        const isMuted = await getMuteStatus();
        console.log(`System is ${isMuted ? 'muted' : 'not muted'}`);
        
    } catch (error) {
        console.error('Error in main function:', error.message);
    }
    
    console.log('Ready for audio control commands');
}

// Run the main function
if (require.main === module) {
    main();
}

module.exports = { 
    main,
    getCurrentVolume,
    setVolume,
    getMuteStatus,
    mute,
    unmute,
    increaseVolume,
    decreaseVolume
}; 