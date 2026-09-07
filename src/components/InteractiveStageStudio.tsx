import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Sparkles, Zap, Play, Square, Volume2, VolumeX, 
  Activity, Sliders, Layers, Plus, Check, ArrowRight, 
  Radio, Disc, Flame, Shield, RefreshCw, Eye, Grid, 
  DraftingCompass, FileText, CheckCircle2, SlidersHorizontal
} from 'lucide-react';
import { 
  playKickBass, playSnare, playHiHat, playAcousticSweep, 
  playLaserClick, setAudioMuted, getAudioMuted 
} from '../utils/audioSynth';
import { useToast } from './ToastProvider';

interface InteractiveStageStudioProps {
  onOpenQuoteModal: () => void;
  onAddToCart?: (item: any, type: 'rental' | 'package') => void;
}

// Preset color options for DMX moving heads
const LIGHT_COLORS = [
  { name: 'Techno Red', hex: '#FF1E1E', rgb: '255, 30, 30' },
  { name: 'Cyber Cyan', hex: '#00F0FF', rgb: '0, 240, 255' },
  { name: 'Ultra Violet', hex: '#9D00FF', rgb: '157, 0, 255' },
  { name: 'Acid Lime', hex: '#00FF66', rgb: '0, 255, 102' },
  { name: 'Golden Amber', hex: '#FFAA00', rgb: '255, 170, 0' },
  { name: 'Pure White', hex: '#FFFFFF', rgb: '255, 255, 255' },
];

export const InteractiveStageStudio: React.FC<InteractiveStageStudioProps> = ({
  onOpenQuoteModal,
  onAddToCart,
}) => {
  const { addToast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // View Mode: Realistic 3D Render vs Technical CAD Wireframe Schematic
  const [viewMode, setViewMode] = useState<'realistic' | 'wireframe'>('realistic');
  const [schematicLayer, setSchematicLayer] = useState<'all' | 'audio' | 'lighting' | 'power'>('all');

  // Studio Mode State
  const [activeTab, setActiveTab] = useState<'lighting' | 'audio' | 'ledwall' | 'rigbuilder'>('lighting');
  const [isAudioMuted, setIsAudioMutedState] = useState<boolean>(getAudioMuted());

  // Lighting Simulation State
  const [selectedColor, setSelectedColor] = useState(LIGHT_COLORS[0]);
  const [beamSpread, setBeamSpread] = useState<number>(35);
  const [sweepSpeed, setSweepSpeed] = useState<number>(1.5);
  const [isStrobeActive, setIsStrobeActive] = useState<boolean>(false);
  const [hazeDensity, setHazeDensity] = useState<number>(60);
  const [beamCount, setBeamCount] = useState<number>(6);

  // Audio Simulation State
  const [isAutoBeatPlaying, setIsAutoBeatPlaying] = useState<boolean>(false);
  const [bpm, setBpm] = useState<number>(128);
  const [bassLevel, setBassLevel] = useState<number>(85);
  const [trebleLevel, setTrebleLevel] = useState<number>(75);
  const beatTimerRef = useRef<number | null>(null);
  const beatStepRef = useRef<number>(0);

  // LED Wall Simulation State
  const [ledMode, setLedMode] = useState<'audioSpectrum' | '3dHologram' | 'cyberGrid' | 'testPattern'>('3dHologram');

  // Rig Builder Customizer State
  const [rigConfig, setRigConfig] = useState({
    lineArrayTops: 8, // units
    subwoofers: 6, // units
    movingHeads: 12, // units
    ledWallM2: 18, // m²
    stageHazers: 2, // units
    powerGen: '45kVA Silent Diesel'
  });

  // Calculate live Rig Specs
  const calculatedSpecs = React.useMemo(() => {
    const topsWattage = rigConfig.lineArrayTops * 1200;
    const subsWattage = rigConfig.subwoofers * 2400;
    const lightsWattage = rigConfig.movingHeads * 350;
    const ledWattage = rigConfig.ledWallM2 * 450;
    const hazerWattage = rigConfig.stageHazers * 1500;
    
    const totalWatts = topsWattage + subsWattage + lightsWattage + ledWattage + hazerWattage;
    const totalKva = (totalWatts / 1000) * 1.25; // 1.25 power factor buffer
    const estSpl = 110 + Math.round(Math.log10(Math.max(1, rigConfig.lineArrayTops + rigConfig.subwoofers * 1.5)) * 18);
    const estCrowdCap = (rigConfig.lineArrayTops * 350) + (rigConfig.subwoofers * 400);

    const estDailyRate = (rigConfig.lineArrayTops * 2500) + 
      (rigConfig.subwoofers * 3000) + 
      (rigConfig.movingHeads * 1200) + 
      (rigConfig.ledWallM2 * 1800) + 
      (rigConfig.stageHazers * 1500);

    let recommendedGen = '25kVA Silent Diesel';
    if (totalKva > 50) recommendedGen = '100kVA Heavy-Duty Generator';
    else if (totalKva > 30) recommendedGen = '60kVA Silent Diesel';
    else if (totalKva > 18) recommendedGen = '45kVA Silent Diesel';

    return {
      totalKw: (totalWatts / 1000).toFixed(1),
      totalKva: totalKva.toFixed(1),
      estSpl,
      estCrowdCap,
      estDailyRate,
      recommendedGen
    };
  }, [rigConfig]);

  // Audio Toggle
  const toggleMute = () => {
    const next = !isAudioMuted;
    setIsAudioMutedState(next);
    setAudioMuted(next);
    addToast(next ? 'Live Audio Muted' : 'Live Audio Enabled (Web Audio Synthesizer)', 'info');
  };

  // Auto Beat Loop Engine
  useEffect(() => {
    if (!isAutoBeatPlaying) {
      if (beatTimerRef.current) {
        window.clearInterval(beatTimerRef.current);
        beatTimerRef.current = null;
      }
      return;
    }

    const intervalMs = (60 / bpm) * 1000 / 4; // 16th notes
    beatTimerRef.current = window.setInterval(() => {
      const step = beatStepRef.current % 16;
      beatStepRef.current = step + 1;

      // 4/4 Beat pattern: Kick on 0, 4, 8, 12
      if (step === 0 || step === 4 || step === 8 || step === 12) {
        playKickBass();
      }
      // Snare on 4, 12
      if (step === 4 || step === 12) {
        playSnare();
      }
      // Hi-Hat on every 2 steps
      if (step % 2 === 0) {
        playHiHat();
      }
    }, intervalMs);

    return () => {
      if (beatTimerRef.current) {
        window.clearInterval(beatTimerRef.current);
      }
    };
  }, [isAutoBeatPlaying, bpm]);

  // Interactive 60fps Canvas Stage Renderer (Supports 3D Realistic & Technical Wireframe Schematic)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.03 * sweepSpeed;
      const width = canvas.width;
      const height = canvas.height;

      // ==========================================
      // VIEW MODE 1: REALISTIC 3D RENDERED VIEW
      // ==========================================
      if (viewMode === 'realistic') {
        // Clear Canvas with Dark Void & Fog gradient
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, width, height);

        // 1. Draw Virtual Stage Floor
        const stageY = height * 0.75;
        const gradient = ctx.createLinearGradient(0, stageY, 0, height);
        gradient.addColorStop(0, '#111111');
        gradient.addColorStop(1, '#030303');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, stageY);
        ctx.lineTo(width, stageY);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.fill();

        // Stage Perspective Grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        const vanishingX = width / 2;
        const vanishingY = height * 0.45;

        for (let i = -10; i <= 10; i++) {
          ctx.beginPath();
          ctx.moveTo(vanishingX, vanishingY);
          ctx.lineTo(vanishingX + (i * width * 0.12), height);
          ctx.stroke();
        }

        // Stage Floor Edge Glow
        ctx.strokeStyle = selectedColor.hex;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(width * 0.1, stageY);
        ctx.lineTo(width * 0.9, stageY);
        ctx.stroke();

        // 2. Draw Virtual P3.91 LED Video Wall in Background
        const wallW = width * 0.55;
        const wallH = height * 0.4;
        const wallX = (width - wallW) / 2;
        const wallY = height * 0.22;

        // LED Wall Screen Frame
        ctx.fillStyle = '#020202';
        ctx.fillRect(wallX, wallY, wallW, wallH);
        ctx.strokeStyle = 'rgba(255, 30, 30, 0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(wallX, wallY, wallW, wallH);

        // Render Active LED Wall Content
        ctx.save();
        ctx.beginPath();
        ctx.rect(wallX, wallY, wallW, wallH);
        ctx.clip();

        if (ledMode === '3dHologram') {
          // 3D Rotating Geometric Wireframe
          const centerX = wallX + wallW / 2;
          const centerY = wallY + wallH / 2;
          const size = Math.min(wallW, wallH) * 0.32;
          const rot = time * 0.8;

          ctx.strokeStyle = selectedColor.hex;
          ctx.lineWidth = 2.5;

          // Rotating Polygon Nodes
          const numPoints = 6;
          const points: [number, number][] = [];
          for (let i = 0; i < numPoints; i++) {
            const angle = (i * 2 * Math.PI / numPoints) + rot;
            const px = centerX + Math.cos(angle) * size;
            const py = centerY + Math.sin(angle) * (size * 0.6) + Math.sin(time * 2 + i) * 8;
            points.push([px, py]);
          }

          ctx.beginPath();
          points.forEach((p, idx) => {
            if (idx === 0) ctx.moveTo(p[0], p[1]);
            else ctx.lineTo(p[0], p[1]);
          });
          ctx.closePath();
          ctx.stroke();

          // Cross diagonals
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.beginPath();
          points.forEach((p, idx) => {
            const target = points[(idx + 3) % numPoints];
            ctx.moveTo(p[0], p[1]);
            ctx.lineTo(target[0], target[1]);
          });
          ctx.stroke();

          // Center Brand Text
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 12px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('TECHNO CORE P3.91', centerX, centerY + 4);
        } else if (ledMode === 'audioSpectrum') {
          // High-Density Graphic Equalizer Bars
          const numBars = 28;
          const barWidth = (wallW - 20) / numBars;
          for (let i = 0; i < numBars; i++) {
            const barHeight = Math.abs(Math.sin(time * 3 + i * 0.35)) * (wallH * 0.75) + 8;
            const bx = wallX + 10 + (i * barWidth);
            const by = wallY + wallH - barHeight - 4;

            const barGrad = ctx.createLinearGradient(0, by, 0, by + barHeight);
            barGrad.addColorStop(0, selectedColor.hex);
            barGrad.addColorStop(1, '#FF1E1E');
            ctx.fillStyle = barGrad;
            ctx.fillRect(bx, by, barWidth - 2, barHeight);
          }
        } else if (ledMode === 'cyberGrid') {
          // Matrix Cyber Tunnel
          ctx.strokeStyle = selectedColor.hex;
          ctx.lineWidth = 1;
          for (let ring = 1; ring <= 5; ring++) {
            const ringSize = (ring * 20 + (time * 25) % 25);
            ctx.strokeRect(
              wallX + wallW / 2 - ringSize * 1.5,
              wallY + wallH / 2 - ringSize,
              ringSize * 3,
              ringSize * 2
            );
          }
        } else {
          // SMPTE Test Pattern
          const colors = ['#C0C0C0', '#C0C000', '#00C0C0', '#00C000', '#C000C0', '#C00000', '#0000C0'];
          const colW = wallW / colors.length;
          colors.forEach((col, idx) => {
            ctx.fillStyle = col;
            ctx.fillRect(wallX + (idx * colW), wallY, colW, wallH * 0.7);
          });
          ctx.fillStyle = '#111';
          ctx.fillRect(wallX, wallY + wallH * 0.7, wallW, wallH * 0.3);
        }
        ctx.restore();

        // 3. Draw Stage Hazer / Fog Particles
        if (hazeDensity > 0) {
          ctx.fillStyle = `rgba(255, 255, 255, ${hazeDensity * 0.0008})`;
          ctx.fillRect(0, 0, width, height);
        }

        // 4. Draw DMX Moving Head Light Beams
        const trussY = 25;
        const trussSpacing = (width * 0.8) / (beamCount + 1);
        const trussStartX = width * 0.1;

        // Strobe check
        const isFlashing = isStrobeActive && Math.floor(Date.now() / 60) % 2 === 0;

        for (let b = 0; b < beamCount; b++) {
          const fixtureX = trussStartX + (b + 1) * trussSpacing;
          const fixtureY = trussY;

          // Oscillating beam angle
          const phaseOffset = b * 0.5;
          const targetAngle = Math.sin(time + phaseOffset) * (beamSpread * 0.015);
          const beamTargetX = fixtureX + Math.sin(targetAngle) * (height - fixtureY);
          const beamTargetY = stageY + 30;

          // Beam gradient
          const beamGrad = ctx.createRadialGradient(
            fixtureX, fixtureY, 2,
            beamTargetX, beamTargetY, 70
          );

          if (isFlashing) {
            beamGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
            beamGrad.addColorStop(0.3, `rgba(${selectedColor.rgb}, 0.7)`);
            beamGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          } else {
            beamGrad.addColorStop(0, `rgba(255, 255, 255, 0.8)`);
            beamGrad.addColorStop(0.2, `rgba(${selectedColor.rgb}, 0.45)`);
            beamGrad.addColorStop(0.7, `rgba(${selectedColor.rgb}, 0.15)`);
            beamGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          }

          // Draw Cone Beam
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(fixtureX - 6, fixtureY);
          ctx.lineTo(beamTargetX + 50, beamTargetY);
          ctx.lineTo(beamTargetX - 50, beamTargetY);
          ctx.lineTo(fixtureX + 6, fixtureY);
          ctx.closePath();
          ctx.fillStyle = beamGrad;
          ctx.fill();

          // Floor Light Spotlight Oval
          ctx.beginPath();
          ctx.ellipse(beamTargetX, stageY + 10, 45, 14, 0, 0, 2 * Math.PI);
          ctx.fillStyle = `rgba(${selectedColor.rgb}, 0.25)`;
          ctx.fill();

          // Fixture Housing
          ctx.fillStyle = '#222';
          ctx.fillRect(fixtureX - 8, fixtureY - 10, 16, 12);
          ctx.fillStyle = selectedColor.hex;
          ctx.beginPath();
          ctx.arc(fixtureX, fixtureY, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Truss Rig Bar
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(width * 0.05, trussY - 8);
        ctx.lineTo(width * 0.95, trussY - 8);
        ctx.stroke();

      } else {
        // ====================================================
        // VIEW MODE 2: TECHNICAL WIREFRAME SCHEMATIC (CAD)
        // ====================================================
        // 1. Technical Blueprint Canvas Background
        ctx.fillStyle = '#040914';
        ctx.fillRect(0, 0, width, height);

        // 2. CAD Coordinate Grid Lines
        // Minor grid 20px
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.07)';
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 20) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += 20) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Major grid 80px
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.16)';
        ctx.lineWidth = 1.5;
        for (let x = 0; x < width; x += 80) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += 80) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Center Datum Axis (X = 0.0m)
        const centerX = width / 2;
        const stageY = height * 0.72;

        ctx.strokeStyle = 'rgba(0, 240, 255, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(centerX, 15);
        ctx.lineTo(centerX, height - 15);
        ctx.stroke();
        ctx.setLineDash([]);

        // Axis Dimension Labels
        ctx.fillStyle = 'rgba(0, 240, 255, 0.7)';
        ctx.font = '9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('CL 0.0m', centerX, height - 6);
        ctx.fillText('-4.0m', centerX - width * 0.28, height - 6);
        ctx.fillText('+4.0m', centerX + width * 0.28, height - 6);
        ctx.fillText('-6.0m', width * 0.08, height - 6);
        ctx.fillText('+6.0m', width * 0.92, height - 6);

        // Height Elevation Markers
        ctx.textAlign = 'left';
        ctx.fillText('ELEV +7.0m [TRUSS]', 8, 22);
        ctx.fillText('ELEV +4.5m [LED TOP]', 8, height * 0.32);
        ctx.fillText('ELEV +1.2m [STAGE]', 8, stageY - 4);
        ctx.fillText('ELEV +0.0m [GROUND]', 8, height - 20);

        // 3. Technical Title Block (Top Right CAD Legend)
        const tbW = 200;
        const tbH = 46;
        const tbX = width - tbW - 10;
        const tbY = 8;

        ctx.fillStyle = 'rgba(4, 12, 28, 0.88)';
        ctx.fillRect(tbX, tbY, tbW, tbH);
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.strokeRect(tbX, tbY, tbW, tbH);

        ctx.fillStyle = '#00F0FF';
        ctx.font = 'bold 9px monospace';
        ctx.fillText('TECHNO CORE CAD SCHEMATIC', tbX + 8, tbY + 13);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '8px monospace';
        ctx.fillText(`RIG: 12m SPAN • LOAD: ${calculatedSpecs.totalKva} kVA`, tbX + 8, tbY + 25);
        ctx.fillStyle = 'rgba(0, 240, 255, 0.8)';
        ctx.fillText(`DMX UNIVERSE 01 (1-${beamCount * 16} CH) • 1:50`, tbX + 8, tbY + 37);

        // 4. Overhead Rigging Truss (12.0m Box Truss with Cross-Lattice Webbing)
        const trussY = 32;
        const trussStartX = width * 0.06;
        const trussEndX = width * 0.94;
        const trussWidth = trussEndX - trussStartX;
        const trussHeight = 14;

        // Box Truss Chords
        ctx.strokeStyle = '#00F0FF';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(trussStartX, trussY, trussWidth, trussHeight);

        // Truss Internal Zig-Zag Bracing
        ctx.beginPath();
        const braceStep = 16;
        for (let bx = trussStartX; bx < trussEndX; bx += braceStep) {
          ctx.moveTo(bx, trussY);
          ctx.lineTo(bx + braceStep / 2, trussY + trussHeight);
          ctx.lineTo(bx + braceStep, trussY);
        }
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
        ctx.stroke();

        // Hoist Rigging Points & Chains
        const hoistX1 = width * 0.18;
        const hoistX2 = width * 0.82;

        [hoistX1, hoistX2].forEach((hx, hIdx) => {
          // Chain line
          ctx.strokeStyle = '#FFCC00';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(hx, 0);
          ctx.lineTo(hx, trussY);
          ctx.stroke();
          ctx.setLineDash([]);

          // Hoist Motor Block
          ctx.fillStyle = '#FFCC00';
          ctx.fillRect(hx - 6, trussY - 9, 12, 8);
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 6px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('1T', hx, trussY - 3);

          // Label
          ctx.fillStyle = '#FFCC00';
          ctx.font = '7px monospace';
          ctx.fillText(`M${hIdx + 1}: 1-TON HOIST`, hx, trussY - 12);
        });

        // Truss Dimension Line
        ctx.strokeStyle = '#00F0FF';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(trussStartX, trussY - 14);
        ctx.lineTo(trussEndX, trussY - 14);
        // Arrow heads
        ctx.moveTo(trussStartX + 6, trussY - 17);
        ctx.lineTo(trussStartX, trussY - 14);
        ctx.lineTo(trussStartX + 6, trussY - 11);
        ctx.moveTo(trussEndX - 6, trussY - 17);
        ctx.lineTo(trussEndX, trussY - 14);
        ctx.lineTo(trussEndX - 6, trussY - 11);
        ctx.stroke();

        ctx.fillStyle = '#00F0FF';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('<--- 12.00m ALUMINUM RIGGING TRUSS SPAN --->', centerX, trussY - 17);

        // 5. Center P3.91 LED Wall Wireframe
        const wallW = width * 0.52;
        const wallH = height * 0.38;
        const wallX = (width - wallW) / 2;
        const wallY = height * 0.22;

        // LED Screen Outline
        ctx.strokeStyle = '#FF8800';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(wallX, wallY, wallW, wallH);

        // Modular Cabinet Grid (500x500mm tiles)
        const cols = 6;
        const rows = 3;
        const tileW = wallW / cols;
        const tileH = wallH / rows;

        ctx.strokeStyle = 'rgba(255, 136, 0, 0.35)';
        ctx.lineWidth = 1;
        for (let c = 1; c < cols; c++) {
          ctx.beginPath();
          ctx.moveTo(wallX + c * tileW, wallY);
          ctx.lineTo(wallX + c * tileW, wallY + wallH);
          ctx.stroke();
        }
        for (let r = 1; r < rows; r++) {
          ctx.beginPath();
          ctx.moveTo(wallX, wallY + r * tileH);
          ctx.lineTo(wallX + wallW, wallY + r * tileH);
          ctx.stroke();
        }

        // Cross center guide on LED Wall
        ctx.strokeStyle = 'rgba(255, 136, 0, 0.5)';
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(wallX, wallY + wallH / 2);
        ctx.lineTo(wallX + wallW, wallY + wallH / 2);
        ctx.moveTo(wallX + wallW / 2, wallY);
        ctx.lineTo(wallX + wallW / 2, wallY + wallH);
        ctx.stroke();
        ctx.setLineDash([]);

        // LED Wall Spec Annotation
        ctx.fillStyle = '#FF8800';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`P3.91 LED MATRIX (${rigConfig.ledWallM2}m² • 1536x768px)`, wallX + wallW / 2, wallY + wallH / 2 - 4);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '7px monospace';
        ctx.fillText('NovaStar VX1000 4K Loop [IP65 3840Hz]', wallX + wallW / 2, wallY + wallH / 2 + 8);

        // 6. Stage Deck Riser Platform
        ctx.strokeStyle = '#00F0FF';
        ctx.lineWidth = 2;
        const stageDeckW = width * 0.84;
        const stageDeckH = 20;
        const stageDeckX = (width - stageDeckW) / 2;

        ctx.strokeRect(stageDeckX, stageY, stageDeckW, stageDeckH);
        
        // Stage Riser Panels (2m x 1m modules)
        const numDecks = 8;
        const deckStep = stageDeckW / numDecks;
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
        ctx.lineWidth = 1;
        for (let d = 1; d < numDecks; d++) {
          ctx.beginPath();
          ctx.moveTo(stageDeckX + d * deckStep, stageY);
          ctx.lineTo(stageDeckX + d * deckStep, stageY + stageDeckH);
          ctx.stroke();
        }

        // Stage Deck Legs
        ctx.strokeStyle = '#00F0FF';
        ctx.lineWidth = 1.5;
        for (let d = 0; d <= numDecks; d++) {
          ctx.beginPath();
          ctx.moveTo(stageDeckX + d * deckStep, stageY + stageDeckH);
          ctx.lineTo(stageDeckX + d * deckStep, height - 18);
          ctx.stroke();
        }

        ctx.fillStyle = '#00F0FF';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('STAGE RISER DECK: 12.0m x 8.0m (+1.2m ELEVATION)', centerX, stageY + 13);

        // 7. Flown Line Array Left & Right Hangs
        const topsPerSide = Math.max(2, Math.round(rigConfig.lineArrayTops / 2));
        const arrayW = 22;
        const arrayBoxH = 8;
        const arrayHangY = trussY + trussHeight + 4;

        const arrayLeftX = width * 0.09;
        const arrayRightX = width * 0.91;

        [
          { x: arrayLeftX, name: 'L-ARRAY L', isLeft: true },
          { x: arrayRightX, name: 'L-ARRAY R', isLeft: false }
        ].forEach((arr) => {
          // Bumper Bar
          ctx.fillStyle = '#00FF66';
          ctx.fillRect(arr.x - arrayW / 2 - 2, arrayHangY, arrayW + 4, 3);

          // Line Array Box Stack
          for (let b = 0; b < topsPerSide; b++) {
            const boxY = arrayHangY + 4 + (b * (arrayBoxH + 2));
            const splayCurvature = (b * 1.2) * (arr.isLeft ? 1 : -1);

            ctx.strokeStyle = '#00FF66';
            ctx.lineWidth = 1.2;
            ctx.strokeRect(arr.x - arrayW / 2 + splayCurvature, boxY, arrayW, arrayBoxH);
            
            // Waveguide Horn circle
            ctx.beginPath();
            ctx.arc(arr.x + splayCurvature, boxY + arrayBoxH / 2, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#00FF66';
            ctx.fill();
          }

          // Acoustic Coverage Cones if active
          if (schematicLayer === 'all' || schematicLayer === 'audio') {
            ctx.strokeStyle = 'rgba(0, 255, 102, 0.4)';
            ctx.lineWidth = 1;
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.moveTo(arr.x, arrayHangY + topsPerSide * 10);
            if (arr.isLeft) {
              ctx.lineTo(width * 0.02, height - 10);
              ctx.moveTo(arr.x, arrayHangY + topsPerSide * 10);
              ctx.lineTo(width * 0.55, height - 10);
            } else {
              ctx.lineTo(width * 0.45, height - 10);
              ctx.moveTo(arr.x, arrayHangY + topsPerSide * 10);
              ctx.lineTo(width * 0.98, height - 10);
            }
            ctx.stroke();
            ctx.setLineDash([]);
          }

          // Label
          ctx.fillStyle = '#00FF66';
          ctx.font = 'bold 7px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`${arr.name}`, arr.x, arrayHangY + topsPerSide * 10 + 12);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.font = '6px monospace';
          ctx.fillText(`${topsPerSide}x VTX 120°x10°`, arr.x, arrayHangY + topsPerSide * 10 + 20);
        });

        // 8. DMX Moving Head Lighting Fixtures (on Truss)
        const fixtureSpacing = trussWidth / (beamCount + 1);
        const fixtureY = trussY + trussHeight;

        // DMX Daisy Chain Vector
        if (schematicLayer === 'all' || schematicLayer === 'lighting') {
          ctx.strokeStyle = '#FF00D4';
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 2]);
          ctx.beginPath();
          ctx.moveTo(trussStartX, fixtureY + 6);
          for (let f = 0; f < beamCount; f++) {
            const fx = trussStartX + (f + 1) * fixtureSpacing;
            ctx.lineTo(fx, fixtureY + 6);
          }
          ctx.stroke();
          ctx.setLineDash([]);
        }

        for (let f = 0; f < beamCount; f++) {
          const fx = trussStartX + (f + 1) * fixtureSpacing;
          const chStart = f * 16 + 1;

          // Fixture base & Yoke
          ctx.strokeStyle = '#FF1E1E';
          ctx.lineWidth = 1.2;
          ctx.strokeRect(fx - 5, fixtureY, 10, 6);

          // Lamp Lens
          ctx.beginPath();
          ctx.arc(fx, fixtureY + 9, 4, 0, Math.PI * 2);
          ctx.fillStyle = selectedColor.hex;
          ctx.fill();
          ctx.strokeStyle = '#FFFFFF';
          ctx.stroke();

          // Beam Aim Vector Line
          if (schematicLayer === 'all' || schematicLayer === 'lighting') {
            const phaseOffset = f * 0.5;
            const targetAngle = Math.sin(time + phaseOffset) * (beamSpread * 0.015);
            const targetX = fx + Math.sin(targetAngle) * (stageY - fixtureY);

            ctx.strokeStyle = `rgba(${selectedColor.rgb}, 0.5)`;
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 3]);
            ctx.beginPath();
            ctx.moveTo(fx, fixtureY + 12);
            ctx.lineTo(targetX, stageY);
            ctx.stroke();
            ctx.setLineDash([]);

            // Floor Target Circle
            ctx.beginPath();
            ctx.ellipse(targetX, stageY, 12, 4, 0, 0, Math.PI * 2);
            ctx.strokeStyle = selectedColor.hex;
            ctx.stroke();

            // Fixture ID & DMX Channel badge
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 6px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`MH-0${f + 1}`, fx, fixtureY - 4);
            ctx.fillStyle = '#00F0FF';
            ctx.fillText(`CH:${String(chStart).padStart(3, '0')}`, fx, fixtureY + 22);
          }
        }

        // 9. Ground Subwoofer Array (In front of Stage)
        const numSubs = Math.max(2, Math.min(8, rigConfig.subwoofers));
        const subTotalW = numSubs * 24 + (numSubs - 1) * 4;
        const subStartX = (width - subTotalW) / 2;
        const subY = height - 32;

        for (let s = 0; s < numSubs; s++) {
          const sx = subStartX + s * 28;
          
          // Sub Box
          ctx.strokeStyle = '#00FF66';
          ctx.lineWidth = 1.2;
          ctx.strokeRect(sx, subY, 24, 14);

          // Dual 18" speaker cone circles
          ctx.beginPath();
          ctx.arc(sx + 6, subY + 7, 4, 0, Math.PI * 2);
          ctx.arc(sx + 18, subY + 7, 4, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(0, 255, 102, 0.6)';
          ctx.stroke();

          // Polarity (+) sign
          ctx.fillStyle = '#00FF66';
          ctx.font = 'bold 5px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('+', sx + 6, subY + 9);
          ctx.fillText('+', sx + 18, subY + 9);
        }

        if (schematicLayer === 'all' || schematicLayer === 'audio') {
          // Sub-Bass wavefront arcs
          ctx.strokeStyle = 'rgba(0, 255, 102, 0.3)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(centerX, subY + 7, 60, Math.PI * 0.8, Math.PI * 2.2);
          ctx.arc(centerX, subY + 7, 90, Math.PI * 0.85, Math.PI * 2.15);
          ctx.stroke();

          ctx.fillStyle = '#00FF66';
          ctx.font = 'bold 7px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`SUB-ARRAY: ${numSubs}x DUAL 18" (35Hz SUB-BASS)`, centerX, height - 6);
        }

        // 10. Power Distribution / Generator Tie-In (Stage Left)
        if (schematicLayer === 'all' || schematicLayer === 'power') {
          const pwrX = 14;
          const pwrY = stageY + 4;

          // Distro box symbol
          ctx.fillStyle = '#FF1E1E';
          ctx.fillRect(pwrX, pwrY, 26, 16);
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 5px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('3Φ DISTRO', pwrX + 13, pwrY + 7);
          ctx.fillText('63A 400V', pwrX + 13, pwrY + 13);

          // Power Feeder Cable trace to stage systems
          ctx.strokeStyle = '#FF1E1E';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([2, 2]);
          ctx.beginPath();
          ctx.moveTo(pwrX + 26, pwrY + 8);
          ctx.lineTo(wallX, pwrY + 8);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // 11. Bottom Schematic Subsystem Legend (Bottom Left)
        const legX = 10;
        const legY = height - 52;
        ctx.fillStyle = 'rgba(4, 12, 28, 0.88)';
        ctx.fillRect(legX, legY, 155, 34);
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
        ctx.strokeRect(legX, legY, 155, 34);

        ctx.fillStyle = '#00FF66';
        ctx.font = '7px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('■ AUDIO ARRAY (AES67 / Dante)', legX + 6, legY + 8);
        ctx.fillStyle = '#FF00D4';
        ctx.fillText('■ DMX-512 LIGHTING LOOP', legX + 6, legY + 16);
        ctx.fillStyle = '#FF8800';
        ctx.fillText('■ P3.91 LED VIDEO DATA LOOP', legX + 6, legY + 24);
        ctx.fillStyle = '#FF1E1E';
        ctx.fillText('■ 3-PHASE 400V POWER FEEDER', legX + 6, legY + 32);
      }

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [
    viewMode, schematicLayer, rigConfig, calculatedSpecs, 
    selectedColor, beamSpread, sweepSpeed, isStrobeActive, 
    hazeDensity, beamCount, ledMode
  ]);

  // Handle add to quote
  const handleAddRigToQuote = () => {
    if (onAddToCart) {
      onAddToCart(
        {
          id: `custom-rig-${Date.now()}`,
          name: `Custom Concert Rig (${rigConfig.lineArrayTops}x Tops, ${rigConfig.subwoofers}x Subs, ${rigConfig.movingHeads}x Beams, ${rigConfig.ledWallM2}m² LED Wall)`,
          dayRate: calculatedSpecs.estDailyRate,
          eventRate: calculatedSpecs.estDailyRate * 1.6,
          image: '/techno_core_3d_logo.jpg'
        },
        'package'
      );
    }
    addToast('Configured Stage Rig transferred to your Quote Sheet!', 'success');
    onOpenQuoteModal();
  };

  return (
    <div className="w-full bg-[#080808] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-2xl space-y-6">
      
      {/* Top Header & Interactive Mode Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FF1E1E]/10 border border-[#FF1E1E]/30 text-[#FF1E1E] text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FF1E1E] animate-ping" />
              Live Interactive Production Studio
            </span>
            <span className="text-gray-500 text-xs font-mono hidden sm:inline">• Web Audio, DMX & CAD Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
            <span>Stage Simulator & Loadout Visualizer</span>
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm">
            Switch between realistic 3D lighting simulation and precision technical CAD wireframe schematics for live stage rigging.
          </p>
        </div>

        {/* Action Controls, View Mode Switch & Sound Toggle */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* View Mode Toggle: 3D Render vs CAD Wireframe */}
          <div className="flex items-center bg-black/80 p-1 rounded-xl border border-white/15 shadow-inner">
            <button
              onClick={() => {
                playLaserClick();
                setViewMode('realistic');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                viewMode === 'realistic'
                  ? 'bg-[#FF1E1E] text-black shadow-[0_0_12px_rgba(255,30,30,0.4)]'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Switch to 3D Realistic Render with volumetric lighting and LED visuals"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>3D Render</span>
            </button>
            <button
              onClick={() => {
                playLaserClick();
                setViewMode('wireframe');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                viewMode === 'wireframe'
                  ? 'bg-cyan-400 text-black shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Switch to Technical CAD Wireframe Schematic with equipment placement and dimensions"
            >
              <DraftingCompass className="w-3.5 h-3.5" />
              <span>CAD Wireframe</span>
            </button>
          </div>

          <button
            onClick={toggleMute}
            className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all border ${
              isAudioMuted
                ? 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
            }`}
            title="Toggle Web Audio Synthesizer sound effects"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isAudioMuted ? 'Muted' : 'Audio Live'}</span>
          </button>

          <button
            onClick={() => {
              playLaserClick();
              setIsAutoBeatPlaying(!isAutoBeatPlaying);
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all border ${
              isAutoBeatPlaying
                ? 'bg-[#FF1E1E] text-black border-[#FF1E1E] shadow-[0_0_20px_rgba(255,30,30,0.5)]'
                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
            }`}
          >
            {isAutoBeatPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isAutoBeatPlaying ? 'Stop Beat' : 'Test Beat (128 BPM)'}</span>
          </button>
        </div>
      </div>

      {/* Main Studio Viewport: Canvas Stage + Interactive Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Real-Time Interactive Stage Canvas Viewport */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-[#020202] rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
            <canvas
              ref={canvasRef}
              width={640}
              height={360}
              className="w-full h-full object-contain cursor-crosshair"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                if (x < 0.33) playKickBass();
                else if (x < 0.66) playSnare();
                else playHiHat();
              }}
              title="Click on the virtual stage to trigger audio drum hits"
            />

            {/* Interactive Canvas HUD Overlays */}
            <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
              <span className="px-2 py-0.5 rounded bg-black/80 text-white font-mono text-[9px] font-bold uppercase border border-white/20 backdrop-blur-md">
                FPS: 60 • {viewMode === 'realistic' ? `DMX CH: ${beamCount * 16}` : 'CAD 1:50 SCALE'}
              </span>
              <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-black uppercase ${
                viewMode === 'realistic' ? 'bg-[#FF1E1E]/80 text-black' : 'bg-cyan-400 text-black'
              }`}>
                {viewMode === 'realistic' ? selectedColor.name : 'WIREFRAME SCHEMATIC'}
              </span>
            </div>

            {/* Floating Top Right Direct View Mode Switcher */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playLaserClick();
                  const nextMode = viewMode === 'realistic' ? 'wireframe' : 'realistic';
                  setViewMode(nextMode);
                  addToast(nextMode === 'wireframe' ? 'Technical CAD Wireframe Schematic Enabled' : 'Realistic 3D Render Enabled', 'info');
                }}
                className="px-2.5 py-1.5 rounded-lg bg-black/90 hover:bg-black border border-white/25 hover:border-cyan-400 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg backdrop-blur-md transition-all cursor-pointer group/btn"
                title="Toggle between 3D Realistic Render and Technical CAD Wireframe Schematic"
              >
                {viewMode === 'realistic' ? (
                  <>
                    <DraftingCompass className="w-3.5 h-3.5 text-cyan-400 group-hover/btn:rotate-45 transition-transform" />
                    <span className="hidden sm:inline">Switch to</span>
                    <span className="text-cyan-400">CAD Wireframe</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#FF1E1E] animate-pulse" />
                    <span className="hidden sm:inline">Switch to</span>
                    <span className="text-[#FF1E1E]">3D Realistic</span>
                  </>
                )}
              </button>
            </div>

            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 pointer-events-none">
              <span className="text-[10px] text-gray-400 font-mono bg-black/80 px-2 py-0.5 rounded border border-white/10">
                {viewMode === 'realistic' ? 'Click Stage for Drum Pad' : '1:50 Elevation Vectors Active'}
              </span>
            </div>
          </div>

          {/* Wireframe Schematic Subsystem Filter Strip */}
          {viewMode === 'wireframe' ? (
            <div className="p-2.5 bg-[#040914] border border-cyan-500/30 rounded-xl space-y-1.5 shadow-lg">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <DraftingCompass className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-wider">
                    CAD Schematic Layer Filters:
                  </span>
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                  {(['all', 'audio', 'lighting', 'power'] as const).map((layer) => (
                    <button
                      key={layer}
                      onClick={() => {
                        playLaserClick();
                        setSchematicLayer(layer);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border ${
                        schematicLayer === layer
                          ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      {layer === 'all' && 'All Subsystems'}
                      {layer === 'audio' && '🔊 Audio Throw'}
                      {layer === 'lighting' && '💡 DMX Channels'}
                      {layer === 'power' && '⚡ 3Φ Power Distro'}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-gray-400 font-mono">
                Showing equipment elevation, hoist load ratings (1-Ton), truss span dimensions (12.0m), DMX fixture IDs, and acoustic dispersion angles.
              </p>
            </div>
          ) : (
            /* Quick Sound Pad Trigger Strip in 3D Render Mode */
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => {
                  playKickBass();
                  playLaserClick();
                }}
                className="p-2.5 bg-white/5 hover:bg-[#FF1E1E]/20 border border-white/10 hover:border-[#FF1E1E] rounded-xl text-center transition-all group"
              >
                <div className="text-[10px] font-black uppercase text-white group-hover:text-[#FF1E1E]">Sub Kick</div>
                <div className="text-[8px] text-gray-500 font-mono">50Hz Bass</div>
              </button>

              <button
                onClick={() => {
                  playSnare();
                  playLaserClick();
                }}
                className="p-2.5 bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400 rounded-xl text-center transition-all group"
              >
                <div className="text-[10px] font-black uppercase text-white group-hover:text-cyan-400">Snare Snap</div>
                <div className="text-[8px] text-gray-500 font-mono">1.2kHz Mid</div>
              </button>

              <button
                onClick={() => {
                  playHiHat();
                  playLaserClick();
                }}
                className="p-2.5 bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-400 rounded-xl text-center transition-all group"
              >
                <div className="text-[10px] font-black uppercase text-white group-hover:text-amber-400">Hi-Hat</div>
                <div className="text-[8px] text-gray-500 font-mono">9kHz Shimmer</div>
              </button>

              <button
                onClick={() => {
                  playAcousticSweep();
                  playLaserClick();
                }}
                className="p-2.5 bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-400 rounded-xl text-center transition-all group"
              >
                <div className="text-[10px] font-black uppercase text-white group-hover:text-purple-400">SPL Sweep</div>
                <div className="text-[8px] text-gray-500 font-mono">20Hz - 20kHz</div>
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Multi-Module Interactive Controls */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          
          {/* Studio Category Navigation Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-black/60 border border-white/10 rounded-xl">
            <button
              onClick={() => {
                playLaserClick();
                setActiveTab('lighting');
              }}
              className={`py-2 text-[10px] sm:text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
                activeTab === 'lighting'
                  ? 'bg-[#FF1E1E] text-black shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Lighting
            </button>

            <button
              onClick={() => {
                playLaserClick();
                setActiveTab('ledwall');
              }}
              className={`py-2 text-[10px] sm:text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
                activeTab === 'ledwall'
                  ? 'bg-[#FF1E1E] text-black shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              LED Wall
            </button>

            <button
              onClick={() => {
                playLaserClick();
                setActiveTab('audio');
              }}
              className={`py-2 text-[10px] sm:text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
                activeTab === 'audio'
                  ? 'bg-[#FF1E1E] text-black shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Acoustics
            </button>

            <button
              onClick={() => {
                playLaserClick();
                setActiveTab('rigbuilder');
              }}
              className={`py-2 text-[10px] sm:text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
                activeTab === 'rigbuilder'
                  ? 'bg-[#FF1E1E] text-black shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Rig Builder
            </button>
          </div>

          {/* TAB 1: DMX LIGHTING CONSOLE */}
          {activeTab === 'lighting' && (
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-[#FF1E1E]" />
                  DMX Beam FX Controller
                </span>
                <span className="text-[10px] text-gray-400 font-mono">230W 7R Beam Heads</span>
              </div>

              {/* Color Presets */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  DMX Color Wheel Preset
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {LIGHT_COLORS.map((col) => (
                    <button
                      key={col.name}
                      onClick={() => {
                        playLaserClick();
                        setSelectedColor(col);
                      }}
                      className={`p-2 rounded-xl text-left border flex items-center gap-2 transition-all ${
                        selectedColor.name === col.name
                          ? 'border-white bg-white/15 shadow-lg'
                          : 'border-white/10 bg-white/5 hover:border-white/30'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span className="text-[10px] font-bold text-white truncate">{col.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders & Toggles */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div>
                  <div className="flex justify-between text-[10px] font-bold uppercase text-gray-400 mb-1">
                    <span>Moving Head Sweep Speed</span>
                    <span className="text-white font-mono">{sweepSpeed}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="4"
                    step="0.1"
                    value={sweepSpeed}
                    onChange={(e) => setSweepSpeed(parseFloat(e.target.value))}
                    className="w-full accent-[#FF1E1E] bg-white/10 rounded-lg h-1.5"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-bold uppercase text-gray-400 mb-1">
                    <span>Beam Spread & Pan Range</span>
                    <span className="text-white font-mono">{beamSpread}°</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="65"
                    value={beamSpread}
                    onChange={(e) => setBeamSpread(parseInt(e.target.value, 10))}
                    className="w-full accent-[#FF1E1E] bg-white/10 rounded-lg h-1.5"
                  />
                </div>

                {/* Strobe & Haze Toggles */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      playLaserClick();
                      setIsStrobeActive(!isStrobeActive);
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                      isStrobeActive
                        ? 'bg-amber-400 text-black border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{isStrobeActive ? 'Strobe ON' : 'Strobe Blitz'}</span>
                  </button>

                  <button
                    onClick={() => {
                      playLaserClick();
                      setHazeDensity(hazeDensity > 0 ? 0 : 80);
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                      hazeDensity > 0
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>{hazeDensity > 0 ? 'Stage Haze ON' : 'Clear Fog'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: P3.91 LED VIDEO WALL */}
          {activeTab === 'ledwall' && (
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-[#FF1E1E]" />
                  P3.91 Video Wall Visualizer
                </span>
                <span className="text-[10px] text-gray-400 font-mono">3840Hz Refresh Rate</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    playLaserClick();
                    setLedMode('3dHologram');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    ledMode === '3dHologram'
                      ? 'border-[#FF1E1E] bg-[#FF1E1E]/15 text-white'
                      : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/30'
                  }`}
                >
                  <div className="text-xs font-bold uppercase">3D Hologram</div>
                  <div className="text-[9px] text-gray-500">Rotating Wireframe</div>
                </button>

                <button
                  onClick={() => {
                    playLaserClick();
                    setLedMode('audioSpectrum');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    ledMode === 'audioSpectrum'
                      ? 'border-[#FF1E1E] bg-[#FF1E1E]/15 text-white'
                      : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/30'
                  }`}
                >
                  <div className="text-xs font-bold uppercase">Audio Spectrum</div>
                  <div className="text-[9px] text-gray-500">Live EQ Graphic</div>
                </button>

                <button
                  onClick={() => {
                    playLaserClick();
                    setLedMode('cyberGrid');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    ledMode === 'cyberGrid'
                      ? 'border-[#FF1E1E] bg-[#FF1E1E]/15 text-white'
                      : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/30'
                  }`}
                >
                  <div className="text-xs font-bold uppercase">Cyber Grid</div>
                  <div className="text-[9px] text-gray-500">Matrix Depth Tunnel</div>
                </button>

                <button
                  onClick={() => {
                    playLaserClick();
                    setLedMode('testPattern');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    ledMode === 'testPattern'
                      ? 'border-[#FF1E1E] bg-[#FF1E1E]/15 text-white'
                      : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/30'
                  }`}
                >
                  <div className="text-xs font-bold uppercase">SMPTE Bars</div>
                  <div className="text-[9px] text-gray-500">Calibration Pattern</div>
                </button>
              </div>

              <div className="p-3 bg-black/50 rounded-xl border border-white/10 text-[11px] text-gray-400 leading-relaxed">
                <span className="text-white font-bold">Outdoor Waterproof Panels:</span> 500x500mm & 500x1000mm die-cast aluminum cabinets with NovaStar processing & redundant video signals.
              </div>
            </div>
          )}

          {/* TAB 3: ACOUSTIC FREQUENCY SIMULATOR */}
          {activeTab === 'audio' && (
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-[#FF1E1E]" />
                  Acoustic SPL & DSP Controls
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">Max SPL: 138 dB</span>
              </div>

              {/* Tempo & Sub-bass Controls */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[10px] font-bold uppercase text-gray-400 mb-1">
                    <span>Loop Tempo</span>
                    <span className="text-white font-mono">{bpm} BPM</span>
                  </div>
                  <input
                    type="range"
                    min="90"
                    max="160"
                    value={bpm}
                    onChange={(e) => setBpm(parseInt(e.target.value, 10))}
                    className="w-full accent-[#FF1E1E] bg-white/10 rounded-lg h-1.5"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-bold uppercase text-gray-400 mb-1">
                    <span>Sub-Bass Low-End Gain</span>
                    <span className="text-white font-mono">+{bassLevel}%</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={bassLevel}
                    onChange={(e) => setBassLevel(parseInt(e.target.value, 10))}
                    className="w-full accent-[#FF1E1E] bg-white/10 rounded-lg h-1.5"
                  />
                </div>
              </div>

              <div className="p-3 bg-black/50 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase text-gray-400">Coverage Distance</div>
                  <div className="text-sm font-black text-white">Up to 85 Meters</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-gray-400">Total Dispersion</div>
                  <div className="text-sm font-black text-white">120° H x 15° V</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: STAGE RIG BUILDER & POWER/SPL ESTIMATOR */}
          {activeTab === 'rigbuilder' && (
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#FF1E1E]" />
                  Concert Rig Customizer
                </span>
                <span className="text-[10px] text-amber-400 font-mono font-bold">Auto kW Sizing</span>
              </div>

              {/* Incremental Gear Steppers */}
              <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin">
                
                {/* Line Array Tops */}
                <div className="flex items-center justify-between p-2 bg-black/40 rounded-xl border border-white/5">
                  <div>
                    <div className="text-xs font-bold text-white uppercase">Line Array Tops</div>
                    <div className="text-[9px] text-gray-400 font-mono">1200W Dual 8" Active</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setRigConfig(prev => ({ ...prev, lineArrayTops: Math.max(2, prev.lineArrayTops - 2) }))}
                      className="w-6 h-6 rounded bg-white/10 text-white font-bold flex items-center justify-center hover:bg-white/20"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold w-5 text-center text-white">{rigConfig.lineArrayTops}</span>
                    <button
                      onClick={() => setRigConfig(prev => ({ ...prev, lineArrayTops: Math.min(24, prev.lineArrayTops + 2) }))}
                      className="w-6 h-6 rounded bg-white/10 text-white font-bold flex items-center justify-center hover:bg-white/20"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Subwoofers */}
                <div className="flex items-center justify-between p-2 bg-black/40 rounded-xl border border-white/5">
                  <div>
                    <div className="text-xs font-bold text-white uppercase">Dual 18" Subwoofers</div>
                    <div className="text-[9px] text-gray-400 font-mono">2400W High-SPL Bass</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setRigConfig(prev => ({ ...prev, subwoofers: Math.max(2, prev.subwoofers - 2) }))}
                      className="w-6 h-6 rounded bg-white/10 text-white font-bold flex items-center justify-center hover:bg-white/20"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold w-5 text-center text-white">{rigConfig.subwoofers}</span>
                    <button
                      onClick={() => setRigConfig(prev => ({ ...prev, subwoofers: Math.min(16, prev.subwoofers + 2) }))}
                      className="w-6 h-6 rounded bg-white/10 text-white font-bold flex items-center justify-center hover:bg-white/20"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Moving Heads */}
                <div className="flex items-center justify-between p-2 bg-black/40 rounded-xl border border-white/5">
                  <div>
                    <div className="text-xs font-bold text-white uppercase">Beam 230W Moving Heads</div>
                    <div className="text-[9px] text-gray-400 font-mono">DMX Intelligent Lights</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const next = Math.max(4, rigConfig.movingHeads - 2);
                        setRigConfig(prev => ({ ...prev, movingHeads: next }));
                        setBeamCount(next);
                      }}
                      className="w-6 h-6 rounded bg-white/10 text-white font-bold flex items-center justify-center hover:bg-white/20"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold w-5 text-center text-white">{rigConfig.movingHeads}</span>
                    <button
                      onClick={() => {
                        const next = Math.min(24, rigConfig.movingHeads + 2);
                        setRigConfig(prev => ({ ...prev, movingHeads: next }));
                        setBeamCount(next);
                      }}
                      className="w-6 h-6 rounded bg-white/10 text-white font-bold flex items-center justify-center hover:bg-white/20"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* LED Wall */}
                <div className="flex items-center justify-between p-2 bg-black/40 rounded-xl border border-white/5">
                  <div>
                    <div className="text-xs font-bold text-white uppercase">P3.91 LED Wall Area</div>
                    <div className="text-[9px] text-gray-400 font-mono">{rigConfig.ledWallM2} m² (Modular)</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setRigConfig(prev => ({ ...prev, ledWallM2: Math.max(6, prev.ledWallM2 - 6) }))}
                      className="w-6 h-6 rounded bg-white/10 text-white font-bold flex items-center justify-center hover:bg-white/20"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold w-7 text-center text-white">{rigConfig.ledWallM2}m²</span>
                    <button
                      onClick={() => setRigConfig(prev => ({ ...prev, ledWallM2: Math.min(48, prev.ledWallM2 + 6) }))}
                      className="w-6 h-6 rounded bg-white/10 text-white font-bold flex items-center justify-center hover:bg-white/20"
                    >
                      +
                    </button>
                  </div>
                </div>

              </div>

              {/* Real-time Computed Power Specs */}
              <div className="grid grid-cols-2 gap-2 p-3 bg-black/60 rounded-xl border border-white/10">
                <div>
                  <div className="text-[9px] uppercase font-bold text-gray-400">Total Power Required</div>
                  <div className="text-sm font-black text-amber-400">{calculatedSpecs.totalKw} kW ({calculatedSpecs.totalKva} kVA)</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase font-bold text-gray-400">Rec. Generator</div>
                  <div className="text-xs font-black text-white truncate">{calculatedSpecs.recommendedGen}</div>
                </div>
              </div>

              {/* Add Custom Rig to Quote */}
              <button
                onClick={handleAddRigToQuote}
                className="w-full py-3 bg-[#FF1E1E] hover:bg-white text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(255,30,30,0.4)] flex items-center justify-center gap-2"
              >
                <span>Add Rig to Quote (₱{calculatedSpecs.estDailyRate.toLocaleString()}/day)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
