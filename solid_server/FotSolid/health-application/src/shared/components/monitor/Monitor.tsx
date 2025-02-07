import * as React from 'react';
import {
  GaugeContainer,
  GaugeValueArc,
  GaugeReferenceArc,
  useGaugeState,
} from '@mui/x-charts/Gauge';

function GaugePointer() {
  const { valueAngle, outerRadius, cx, cy } = useGaugeState();

  if (valueAngle === null) {
    // No value to display
    return null;
  }

  const target = {
    x: cx + outerRadius * Math.sin(valueAngle),
    y: cy - outerRadius * Math.cos(valueAngle),
  };
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill="black" />
      <path
        d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
        stroke="black"
        strokeWidth={3}
      />
    </g>
  );
}

function GaugeLabels() {
  const { cx, cy, outerRadius } = useGaugeState();

  // Ângulos inicial e final do gauge (em radianos)
  const startAngle = (-110 * Math.PI) / 180; // Converter para radianos
  const endAngle = (110 * Math.PI) / 180;

  // Distância para posicionar os labels ligeiramente abaixo do arco
  const labelOffsetY = 25;
  const labelOffsetX = 15;

  // Coordenadas dos labels
  const startLabel = {
    x: cx + outerRadius * Math.sin(startAngle) +  labelOffsetX,
    y: cy - outerRadius * Math.cos(startAngle) + labelOffsetY,
  };
  const endLabel = {
    x: cx + outerRadius * Math.sin(endAngle) - labelOffsetX,
    y: cy - outerRadius * Math.cos(endAngle) + labelOffsetY,
  };

  return (
    <g>
      {/* Label "Low Risk" */}
      <text
        x={startLabel.x}
        y={startLabel.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="14"
        fill="black"
      >
        Low Risk
      </text>
      {/* Label "High Risk" */}
      <text
        x={endLabel.x}
        y={endLabel.y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="14"
        fill="black"
      >
        High Risk
      </text>
    </g>
  );
}

export const MonitorRisk = () => {
  const normalizedValue = (-0.5 + 1) / 2;

  // Interpolação entre vermelho (0) e verde (1)
  const red = 255 * normalizedValue; // Quanto maior o valor, menos vermelho
  const green = 255 * (1 - normalizedValue); // Quanto maior o valor, mais verde

  // Cor da barra com base na interpolação entre vermelho e verde
  const barColor = `rgb(${red}, ${green}, 0)`;

  return (
    <GaugeContainer
      width={250}
      height={250}
      startAngle={-110}
      endAngle={110}      
      value={normalizedValue * 100}
    >
      <GaugeReferenceArc />
      <GaugeValueArc style={{ fill: barColor }} />
      <GaugePointer />
      <GaugeLabels />
    </GaugeContainer>
  );
}
