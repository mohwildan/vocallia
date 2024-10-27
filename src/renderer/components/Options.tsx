import React from "react";

interface Props {
  autoSpeak: boolean;
  onClickSpeak: boolean;
  speakDelay: number;
  onAutoSpeakChange: (checked: boolean) => void;
  onClickSpeakChange: (checked: boolean) => void;
  onSpeakDelayChange: (delay: number) => void;
}

const Options: React.FC<Props> = ({
  autoSpeak,
  onClickSpeak,
  speakDelay,
  onAutoSpeakChange,
  onClickSpeakChange,
  onSpeakDelayChange,
}) => {
  return (
    <div className="options">
      <label>
        <input
          type="checkbox"
          checked={autoSpeak}
          onChange={(e) => onAutoSpeakChange(e.target.checked)}
        />
        Auto Speak
      </label>
      <label>
        <input
          type="checkbox"
          checked={onClickSpeak}
          onChange={(e) => onClickSpeakChange(e.target.checked)}
        />
        Click to Speak
      </label>
      <label>
        Speak Delay:
        <input
          type="range"
          className="slider"
          min="0"
          max="5000"
          value={speakDelay}
          onChange={(e) => onSpeakDelayChange(Number(e.target.value))}
        />
        <span>{speakDelay}</span> ms
      </label>
    </div>
  );
};
export default Options;
