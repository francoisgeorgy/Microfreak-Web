import React, {Component} from 'react';
import './App.css';
import Midi from "./components/Midi";
import {Provider} from "mobx-react";
import {state} from "./state/State";
import MidiPorts from "./components/MidiPorts";
import Control from "./components/Control";
import {
    ARP_SEQ_RATE_FREE, ARP_SEQ_RATE_SYNC,
    CYCLING_ENV_AMOUNT, CYCLING_ENV_FALL, CYCLING_ENV_HOLD,
    CYCLING_ENV_RISE, ENVELOPE_ATTACK, ENVELOPE_DECAY, ENVELOPE_SUSTAIN,
    FILTER_CUTOFF,
    FILTER_RESONANCE, GLIDE, KEYBOARD_HOLD_BUTTON, KEYBOARD_SPICE, LFO_RATE_FREE, LFO_RATE_SYNC,
    OSC_SHAPE,
    OSC_TIMBRE,
    OSC_TYPE,
    OSC_WAVE
} from "./model";
import PresetSelector from "./components/PresetSelector";
import ModMatrix from "./components/ModMatrix";
import {hs} from "./utils/hexstring";

const MIDI_MSG_TYPE = "sysex";

class App extends Component {

    handleMidiInputEvent = (e) => {

        // if (global.dev) console.log("handleMidiInputEvent", hs(e.data), e);

        if (e.data[0] === 0xF8) {
            // we ignore Timing Clock messages
            return;
        }

        // if (global.dev) console.log(`handleMidiInputEvent: ${e.controller.number}=${e.value}`);
        // state.preset[e.controller.number] = e.value;


        if (e.data.length != 42) {
            console.log("do not store answer", hs(e.data));
            return;
        }

        // console.log("store sysex data");

        // TODO: move into store:
        state.data.push(Array.from(e.data.slice(9, e.data.length - 1)));    // e.data is UInt8Array
    };

    render() {
        return (
            <Provider state={state}>
                <Midi messageType={MIDI_MSG_TYPE} onMidiInputEvent={this.handleMidiInputEvent}/>
                <div className="App">
                    <h2>MicroFreak</h2>
                    <MidiPorts messageType={MIDI_MSG_TYPE} onMidiInputEvent={this.handleMidiInputEvent}/>
                    <PresetSelector/>
                    <div>
                        <ModMatrix />
                        <div className="main-grid">
                            <div className="group oscillator">
                                <h3>Oscillator</h3>
                                <div className="controls">
                                    <Control cc={OSC_TYPE}/>
                                    <Control cc={OSC_WAVE}/>
                                    <Control cc={OSC_TIMBRE}/>
                                    <Control cc={OSC_SHAPE}/>
                                </div>
                            </div>
                            <div className="group filter">
                                <h3>Filter</h3>
                                <div className="controls">
                                    <Control cc={FILTER_CUTOFF}/>
                                    <Control cc={FILTER_RESONANCE}/>
                                </div>
                            </div>
                            <div className="group cycling-env">
                                <h3>Cycling envelope</h3>
                                <div className="controls">
                                    <Control cc={CYCLING_ENV_RISE}/>
                                    <Control cc={CYCLING_ENV_FALL}/>
                                    <Control cc={CYCLING_ENV_HOLD}/>
                                    <Control cc={CYCLING_ENV_AMOUNT}/>
                                </div>
                            </div>
                            <div className="group arp-seq">
                                <h3>ARP/SEQ</h3>
                                <div className="controls">
                                    <Control cc={ARP_SEQ_RATE_FREE}/>
                                    <Control cc={ARP_SEQ_RATE_SYNC}/>
                                </div>
                            </div>
                            <div className="group lfo">
                                <h3>LFO</h3>
                                <div className="controls">
                                    <Control cc={LFO_RATE_FREE}/>
                                    <Control cc={LFO_RATE_SYNC}/>
                                </div>
                            </div>
                            <div className="group env">
                                <h3>Envelope</h3>
                                <div className="controls">
                                    <Control cc={ENVELOPE_ATTACK}/>
                                    <Control cc={ENVELOPE_DECAY}/>
                                    <Control cc={ENVELOPE_SUSTAIN}/>
                                </div>
                            </div>
                            <div className="group keyboard">
                                <h3>Keyboard</h3>
                                <div className="controls">
                                    <Control cc={GLIDE}/>
                                    <Control cc={KEYBOARD_HOLD_BUTTON}/>
                                    <Control cc={KEYBOARD_SPICE}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Provider>
        );
    }

}

export default App;
