// Office layout node positions for React Flow
export const nodePositions = {
  entrance:      { x: 400, y: 580 },
  lobby:         { x: 400, y: 470 },
  reception:     { x: 220, y: 470 },
  hallway_main:  { x: 400, y: 340 },
  hallway_left:  { x: 180, y: 340 },
  hallway_right: { x: 620, y: 340 },
  conf_a:        { x: 60,  y: 240 },
  conf_b:        { x: 280, y: 240 },
  conf_c:        { x: 740, y: 240 },
  open_office:   { x: 520, y: 240 },
  hallway_upper: { x: 400, y: 140 },
  kitchen:       { x: 180, y: 60  },
  break_room:    { x: 180, y: 180 },
  hr_office:     { x: 520, y: 60  },
  ceo_office:    { x: 680, y: 60  },
  server_room:   { x: 740, y: 340 },
  restrooms:     { x: 60,  y: 470 },
  meeting_pod_1: { x: 620, y: 140 },
  meeting_pod_2: { x: 320, y: 60  },
  storage:       { x: 60,  y: 340 },
};

export const nodeStyles = {
  room: {
    background: '#EFF6FF',
    border: '2px solid #1A4FAD',
    color: '#1A4FAD',
    icon: '🏢',
  },
  corridor: {
    background: '#F8FAFC',
    border: '2px solid #94A3B8',
    color: '#475569',
    icon: '🚶',
  },
  desk: {
    background: '#FFF7ED',
    border: '2px solid #F59E0B',
    color: '#D97706',
    icon: '🖥️',
  },
};

export const statusColors = {
  available: { bg: '#DCFCE7', text: '#166534', dot: '#22C55E' },
  booked:    { bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' },
};

export const WALK_SPEED_LABEL = '~30 sec / unit';
