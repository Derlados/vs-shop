import React, { useCallback, useEffect, useState, useRef } from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
import "./multiRangeSlider.scss";

const MultiRangeSlider = ({ min, max, selectedMin = min, selectedMax = max, onChange, onAccept }) => {
    const [minVal, setMinVal] = useState(selectedMin);
    const [maxVal, setMaxVal] = useState(selectedMax);
    const [inputMin, setInputMin] = useState(selectedMin);
    const [inputMax, setInputMax] = useState(selectedMax);
    const minValRef = useRef(null);
    const maxValRef = useRef(null);
    const range = useRef(null);


    // Convert to percentage
    const getPercent = useCallback(
        (value) => {
            const percent = Math.round(((value - min) / (max - min)) * 100);
            return percent > 100 ? 100 : percent < 0 ? 0 : percent;
        },
        [min, max]
    );

    // Set width of the range to decrease from the left side
    useEffect(() => {
        if (maxValRef.current) {
            const minPercent = getPercent(minVal);
            const maxPercent = getPercent(+maxValRef.current.value); // Preceding with '+' converts the value from type string to type number

            if (range.current) {
                range.current.style.left = `${minPercent}%`;
                range.current.style.width = `${maxPercent - minPercent}%`;
            }
        }
    }, [minVal, getPercent]);

    // Set width of the range to decrease from the right side
    useEffect(() => {
        if (minValRef.current) {
            const minPercent = getPercent(+minValRef.current.value);
            const maxPercent = getPercent(maxVal);

            if (range.current) {
                range.current.style.width = `${maxPercent - minPercent}%`;
            }
        }
    }, [maxVal, getPercent]);

    // Get min and max values when their state changes
    useEffect(() => {
        onChange({ min: minVal, max: maxVal });
    }, [minVal, maxVal, onChange]);

    const tryAccept = () => {
        if (inputMin <= inputMax) {
            onAccept(inputMin, inputMax);
        }
        setMinVal(inputMin);
        setMaxVal(inputMax);
    }

    return (
        <div>
            <div className="container">
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={minVal}
                    ref={minValRef}
                    onChange={(event) => {
                        const value = Math.min(+event.target.value, maxVal - 1);
                        setMinVal(value);
                        setInputMin(value);
                        event.target.value = value.toString();
                    }}
                    className={classnames("thumb thumb--zindex-3", {
                        "thumb--zindex-5": minVal > max - 100
                    })}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={maxVal}
                    ref={maxValRef}
                    onChange={(event) => {
                        const value = Math.max(+event.target.value, minVal + 1);
                        setMaxVal(value);
                        setInputMax(value);
                        event.target.value = value.toString();
                    }}
                    className="thumb thumb--zindex-4"
                />

                <div className="slider">
                    <div className="slider__track" />
                    <div ref={range} className="slider__range" />

                </div>
            </div>
            <div className="slider__form rcc">
                <div className="rlc">
                    <input type="number" className="slider__input" value={inputMin} onChange={(event) => setInputMin(event.target.value)} />
                    <span className="slider__dash">—</span>
                    <input type="number" className="slider__input" value={inputMax} onChange={(event) => setInputMax(event.target.value)} />
                </div>
                <div className={classnames("slider__accept ccc", {
                    "slider__accept_disable": (inputMin > inputMax || inputMax > max || inputMax === '' || inputMin === '')
                })} onClick={tryAccept}>OK</div>
            </div>
        </div>

    );
};

MultiRangeSlider.propTypes = {
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    onAccept: PropTypes.func.isRequired
};

export default MultiRangeSlider;
