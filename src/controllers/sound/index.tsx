import Sound from 'react-native-sound';
// Enable playback in silence mode
Sound.setCategory('Playback');

var backgroundMusic: any = new Promise((resolve, reject) => {
    let whoosh = new Sound('backgroundmusic.mp3', Sound.MAIN_BUNDLE, (error: any) => {
        if (error) {
            console.log('failed to load the sound', error);
            return;
        }
        const play = () => {
            whoosh.setNumberOfLoops(-1);
            whoosh.play((success: any) => {
                if (success) {
                    console.log('successfully finished playing');
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
        }
        whoosh.setVolume(0.3)
        const stop = () => {
            whoosh.stop()
        }

        const changeVolume = (value: number) => {
            whoosh.setVolume(value);
        }

        resolve({ play, stop, changeVolume })
    });
})

var questionsBackgroundMusic: any = new Promise((resolve, reject) => {
    let whoosh = new Sound('suspension.mp3', Sound.MAIN_BUNDLE, (error: any) => {
        if (error) {
            console.log('failed to load the sound', error);
            return;
        }
        const play = () => {
            whoosh.play((success: any) => {
                if (success) {
                    console.log('successfully finished playing');
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
        }
        whoosh.setVolume(0.3)
        const stop = () => {
            whoosh.stop()
        }

        const changeVolume = (value: number) => {
            whoosh.setVolume(value);
        }

        resolve({ play, stop, changeVolume })
    });
})

var selectSound: any = new Promise((resolve, reject) => {
    let whoosh = new Sound('select.mp3', Sound.MAIN_BUNDLE, (error: any) => {
        if (error) {
            console.log('failed to load the sound', error);
            return;
        }
        const play = () => {
            whoosh.play((success: any) => {
                if (success) {
                    console.log('successfully finished playing');
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
        }
        whoosh.setVolume(0.5)
        const stop = () => {
            whoosh.stop()
        }

        resolve({ play, stop })
    });
})

var loseSound: any = new Promise((resolve, reject) => {
    let whoosh = new Sound('losesound.mp3', Sound.MAIN_BUNDLE, (error: any) => {
        if (error) {
            console.log('failed to load the sound', error);
            return;
        }
        const play = () => {
            whoosh.play((success: any) => {
                if (success) {
                    console.log('successfully finished playing');
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
        }
        whoosh.setVolume(0.5)
        const stop = () => {
            whoosh.stop()
        }

        resolve({ play, stop })
    });
})



var victorySound: any = new Promise((resolve, reject) => {
    let whoosh = new Sound('victorysound.mp3', Sound.MAIN_BUNDLE, (error: any) => {
        if (error) {
            console.log('failed to load the sound', error);
            return;
        }
        const play = () => {
            whoosh.play((success: any) => {
                if (success) {
                    console.log('successfully finished playing');
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
        }
        whoosh.setVolume(0.5)
        const stop = () => {
            whoosh.stop()
        }

        resolve({ play, stop })
    });
})

var videoGameLose: any = new Promise((resolve, reject) => {
    let whoosh = new Sound('videogamelose.mp3', Sound.MAIN_BUNDLE, (error: any) => {
        if (error) {
            console.log('failed to load the sound', error);
            return;
        }
        const play = () => {
            whoosh.play((success: any) => {
                if (success) {
                    console.log('successfully finished playing');
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
        }
        whoosh.setVolume(0.5)
        const stop = () => {
            whoosh.stop()
        }

        resolve({ play, stop })
    });
})

var videoGameLose: any = new Promise((resolve, reject) => {
    let whoosh = new Sound('videogamelose.mp3', Sound.MAIN_BUNDLE, (error: any) => {
        if (error) {
            console.log('failed to load the sound', error);
            return;
        }
        const play = () => {
            whoosh.play((success: any) => {
                if (success) {
                    console.log('successfully finished playing');
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
        }
        whoosh.setVolume(0.5)
        const stop = () => {
            whoosh.stop()
        }

        resolve({ play, stop })
    });
})

var win: any = new Promise((resolve, reject) => {
    let whoosh = new Sound('win.mp3', Sound.MAIN_BUNDLE, (error: any) => {
        if (error) {
            console.log('failed to load the sound', error);
            return;
        }
        const play = () => {
            whoosh.play((success: any) => {
                if (success) {
                    console.log('successfully finished playing');
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
        }
        whoosh.setVolume(0.5)
        const stop = () => {
            whoosh.stop()
        }

        resolve({ play, stop })
    });
})


export const playBackgroundMusic = async () => {
    backgroundMusic.then((res: any) => {
        res.play()
    })
}

export const stopBackgroundMusic = async () => {
    backgroundMusic.then((res: any) => {
        res.stop()
    })
}

export const changeBackgroundMusicVolume = async (value: number) => {
    backgroundMusic.then((res: any) => {
        res.changeVolume(value)
    })
}

export const playSelectSound = async () => {
    selectSound.then((res: any) => {
        res.play()
    })
}

export const playQuestionBackgroundMusic = async () => {
    questionsBackgroundMusic.then((res: any) => {
        res.play()
    })
}

export const stopQuestionBackgroundMusic = async () => {
    questionsBackgroundMusic.then((res: any) => {
        res.stop()
    })
}

export const playLoseSound = async () => {
    loseSound.then((res: any) => {
        res.play()
    })
}

export const stopLoseSound = async () => {
    loseSound.then((res: any) => {
        res.stop()
    })
}

export const playVideoGameLose = async () => {
    videoGameLose.then((res: any) => {
        res.play()
    })
}

export const stopVideoGameLose = async () => {
    videoGameLose.then((res: any) => {
        res.stop()
    })
}

export const playVictorySound = async () => {
    victorySound.then((res: any) => {
        res.play()
    })
}

export const stopVictorySound = async () => {
    victorySound.then((res: any) => {
        res.stop()
    })
}

export const playWin = async () => {
    win.then((res: any) => {
        res.play()
    })
}

export const stopWin = async () => {
    win.then((res: any) => {
        res.stop()
    })
}