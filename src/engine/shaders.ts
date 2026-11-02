// GLSL ES 1.00 so the same sources run on WebGL 1 and 2.
// World space is y-up here; the CSS layer is y-down, so camera y is negated on upload.

export const RAY_VS = /* glsl */ `
precision highp float;
attribute vec2 aCorner;
varying vec2 vNDC;
void main() {
  vNDC = aCorner;
  gl_Position = vec4(aCorner, 0.0, 1.0);
}
`

export const RAY_FS = /* glsl */ `
precision highp float;
varying vec2 vNDC;
uniform vec3 uCamPos;
uniform vec3 uCamAngles;
uniform vec2 uAspectFov;
uniform float uTime;
uniform float uVellum;
uniform float uTrap;
uniform sampler2D uTexCliff;
uniform sampler2D uTexCavern;

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}
float smax(float a, float b, float k) {
  return -smin(-a, -b, k);
}

float gyroidRelief(vec3 p) {
  float g1 = dot(sin(p * 0.011), cos(p.yzx * 0.013));
  float g2 = dot(sin(p * 0.029 + 1.7), cos(p.zxy * 0.031 + 2.3));
  float g3 = dot(sin(p * 0.075 + 4.1), cos(p.yzx * 0.081 + 0.9));
  return g1 * 26.0 + g2 * 11.0 + g3 * 4.2;
}

vec3 sampleTriplanar(sampler2D tex, vec3 p, vec3 w, float sc) {
  return texture2D(tex, p.yz * sc).rgb * w.x +
         texture2D(tex, p.xz * sc).rgb * w.y +
         texture2D(tex, p.xy * sc).rgb * w.z;
}

// Stepped Aksumite altar under the shrine whose relic sits at sPos.
float sdAltar(vec3 P, vec3 sPos, float relief) {
  if (abs(P.z - sPos.z) > 220.0) return 1e5;
  float topY = sPos.y - 168.0;
  float midY = 0.5 * (topY - 300.0);
  float halfH = max(24.0, 0.5 * (topY + 300.0));
  vec3 q = P - vec3(sPos.x, midY, sPos.z);
  float stepCrown = smoothstep(halfH - 28.0, halfH - 8.0, abs(q.y)) * 22.0;
  float w = 78.0 + stepCrown;
  float dShaft = max(max(abs(q.x) - w, abs(q.z) - w), abs(q.y) - halfH);
  float dCross = min(max(abs(q.x) - (w + 14.0), abs(q.z) - 32.0), max(abs(q.x) - 32.0, abs(q.z) - (w + 14.0)));
  dCross = max(dCross, abs(q.y) - halfH);
  return min(dShaft, dCross) + relief * 0.08;
}

float mapAltars(vec3 P, float relief) {
  if (P.z > -850.0)  return sdAltar(P, vec3(210.0, -10.0, -400.0), relief);
  if (P.z > -1800.0) return sdAltar(P, vec3(-205.0, -15.0, -1350.0), relief);
  if (P.z > -2750.0) return sdAltar(P, vec3(205.0, -65.0, -2300.0), relief);
  if (P.z > -3700.0) return sdAltar(P, vec3(-205.0, -25.0, -3250.0), relief);
  if (P.z > -4650.0) return sdAltar(P, vec3(0.0, -15.0, -4200.0), relief);
  if (P.z > -5600.0) return sdAltar(P, vec3(205.0, -10.0, -5150.0), relief);
  if (P.z > -6600.0) return sdAltar(P, vec3(-205.0, -25.0, -6100.0), relief);
  return sdAltar(P, vec3(0.0, -10.0, -7100.0), relief);
}

// x: distance, y: material (1 cliff, 2 carved stone, 3 cave rock, 4.5 water, 6 gilded cross)
vec2 mapScene(vec3 P) {
  float relief = gyroidRelief(P);
  float strata = sin(P.y * 0.048 + sin(P.z * 0.009) * 2.0) * 14.0;

  // Floor: stepped trench outside, sunken pools under the skylight and the apse.
  float stepLift = (P.z > 20.0) ? (floor((P.z - 20.0) / 55.0) * 8.5 + smoothstep(0.0, 12.0, mod(P.z - 20.0, 55.0)) * 8.5) : 0.0;
  float isWaterBasin = smoothstep(320.0, 210.0, abs(P.z + 2300.0)) + smoothstep(340.0, 220.0, abs(P.z + 7050.0));
  float floorH = -280.0 + stepLift * 0.45 - isWaterBasin * 18.0 + relief * 0.14 * (1.0 - isWaterBasin * 0.85);
  float dFloor = P.y - floorH;

  // Open canyon outside the cliff face.
  float canyonMeander = sin(P.z * 0.0045) * 42.0;
  float canyonHalfW = 355.0 + smoothstep(-240.0, 440.0, P.y) * 95.0;
  float shrine0Alcove = exp(-pow((P.z + 400.0) / 155.0, 2.0)) * smoothstep(220.0, -40.0, abs(P.y));
  float rightWallX = canyonHalfW + canyonMeander + shrine0Alcove * 115.0;
  float leftWallX = -canyonHalfW + canyonMeander;
  float dCanyonWalls = min(rightWallX - P.x, P.x - leftWallX) + strata + relief * 0.85;
  dCanyonWalls = smax(dCanyonWalls, P.y - 360.0 - relief * 0.9, 55.0);

  // Cavern shell behind the cliff, swelling into three rotundas.
  float caveSwayX = sin(P.z * 0.0022 + 1.1) * 55.0;
  float rotundaExpand = exp(-pow((P.z + 2300.0) / 480.0, 2.0)) * 135.0 +
                        exp(-pow((P.z + 5000.0) / 520.0, 2.0)) * 145.0 +
                        exp(-pow((P.z + 7000.0) / 560.0, 2.0)) * 130.0;
  float caveRadX = 465.0 + rotundaExpand;
  float caveRadY = 395.0 + rotundaExpand * 0.85;
  vec2 caveEll = vec2((P.x - caveSwayX) / caveRadX, (P.y + 35.0) / caveRadY);
  float dCaveTunnel = (1.0 - length(caveEll)) * min(caveRadX, caveRadY);
  float stalMask = smoothstep(-2900.0, -3400.0, P.z) * smoothstep(-6100.0, -5500.0, P.z) * smoothstep(80.0, 240.0, P.y);
  float stalWave = pow(0.5 + 0.5 * sin(P.x * 0.042) * sin(P.z * 0.042), 2.5);
  dCaveTunnel -= stalMask * stalWave * 115.0;
  dCaveTunnel += relief * 0.95 + strata * 0.55;

  float dSkylightAir = 185.0 - length(vec2(P.x - 60.0, P.z + 2300.0)) - relief * 0.35;
  if (P.y > 0.0) dCaveTunnel = smax(dCaveTunnel, dSkylightAir, 38.0);
  dCaveTunnel = smin(dCaveTunnel, P.z + 7410.0 + relief * 0.35, 42.0);
  // The hill the cave is cut into: a skin of rock over the cave roof, low enough
  // that the sky shows above the cliff from outside.
  float hillTop = max(330.0, caveRadY - 35.0 + 90.0) + relief * 0.8;
  dCaveTunnel = smax(dCaveTunnel, P.y - hillTop, 60.0);

  // Cliff facade with an arched portal at z = -640.
  float archY = max(P.y - 10.0, 0.0);
  float dPortalAir = (P.y >= 10.0)
    ? ((1.0 - length(vec2(P.x / 198.0, archY / 205.0))) * 198.0)
    : (198.0 - abs(P.x));
  float moldingBand = sin(clamp(-dPortalAir, 0.0, 48.0) * 0.26) * 4.5;
  float winX = abs(abs(P.x) - 235.0);
  float blindWinRecess = clamp(38.0 - max(winX - 38.0, abs(P.y - 190.0) - 64.0), 0.0, 22.0);
  float dSlabAir = abs(P.z + 640.0) - 46.0 + relief * 0.28 + moldingBand + blindWinRecess;
  float dPortalWall = smax(smax(dSlabAir, dPortalAir, 12.0), P.y - 330.0 - relief * 0.9, 45.0);

  float wCave = clamp((-595.0 - P.z) / 90.0, 0.0, 1.0);
  float dWorldRock = mix(dCanyonWalls, dCaveTunnel, wCave);
  dWorldRock = smin(dWorldRock, dPortalWall, 18.0);

  // Cruciform columns and vault ribs every 460 units inside the cave.
  float dArch = 1e5;
  if (P.z < -720.0 && P.z > -7200.0) {
    float cellZ = mod(P.z + 230.0, 460.0) - 230.0;
    float bayCenterZ = P.z - cellZ;
    if (abs(bayCenterZ + 2300.0) > 260.0) {
      float colX = abs(P.x - caveSwayX * 0.5) - 325.0;
      float dBox1 = max(abs(colX) - 38.0, abs(cellZ) - 22.0);
      float dBox2 = max(abs(colX) - 22.0, abs(cellZ) - 38.0);
      float dCol = min(dBox1, dBox2) + relief * 0.16;
      float capBand = max(abs(colX) - 52.0, max(abs(cellZ) - 52.0, abs(abs(P.y + 20.0) - 215.0) - 24.0));
      dCol = smin(dCol, capBand, 8.0);
      float dRib = max(abs(cellZ) - 28.0, abs(length(vec2((P.x - caveSwayX * 0.5) * 0.75, P.y - 110.0)) - 255.0) - 32.0);
      dArch = smin(dCol, dRib, 24.0);
    }
  }

  float dAltar = mapAltars(P, relief);
  dArch = smin(dArch, dAltar, 14.0);

  // Carved cross in the apse.
  float dCross = 1e5;
  if (P.z < -7150.0) {
    // Equal-armed cross with flared, stepped ends, as cut into Lalibela's walls.
    vec3 cp = P - vec3(0.0, 250.0, -7365.0);
    vec2 a = abs(cp.xy);
    vec2 q = (a.x > a.y) ? a : a.yx;                       // fold to one arm along +x
    float arm = max(q.x - 120.0, q.y - (22.0 + q.x * 0.12));
    float foot = max(abs(q.x - 112.0) - 12.0, q.y - 44.0);
    float slab = abs(cp.z) - 20.0;
    dCross = max(min(arm, foot), slab);
  }

  float dSolid = smin(dWorldRock, dFloor, 26.0);
  dSolid = smin(dSolid, dArch, 20.0);

  float matId = 3.0;
  if (dCross < dSolid) {
    dSolid = dCross;
    matId = 6.0;
  } else if (P.y < -258.0 && isWaterBasin > 0.35 && dFloor < dWorldRock + 15.0 && dAltar > 18.0) {
    matId = 4.5;
  } else if (dArch < dWorldRock - 8.0) {
    matId = 2.0;
  } else if (P.z > -655.0) {
    matId = 1.0;
  }
  return vec2(dSolid, matId);
}

vec3 calcNormal(vec3 P, float t) {
  // Wider stencil with distance keeps far normals from shimmering.
  float h = clamp(t * 0.0016, 1.1, 6.0);
  vec2 e = vec2(h, -h);
  return normalize(
    e.xyy * mapScene(P + e.xyy).x +
    e.yyx * mapScene(P + e.yyx).x +
    e.yxy * mapScene(P + e.yxy).x +
    e.xxx * mapScene(P + e.xxx).x
  );
}

float calcSoftShadow(vec3 ro, vec3 rd, float mint, float maxt, float k) {
  float res = 1.0;
  float t = mint;
  for (int i = 0; i < 16; i++) {
    if (t > maxt) break;
    float h = mapScene(ro + rd * t).x;
    if (h < 1.5) return 0.06;
    res = min(res, k * h / t);
    t += clamp(h, 14.0, 110.0);
  }
  return clamp(res, 0.06, 1.0);
}

float calcAO(vec3 pos, vec3 nor) {
  float occ = 0.0;
  float sca = 1.0;
  for (int i = 0; i < 4; i++) {
    float h = 10.0 + 34.0 * float(i);
    float d = mapScene(pos + h * nor).x;
    occ += (h - d) * sca;
    sca *= 0.6;
  }
  return clamp(1.0 - 0.012 * occ, 0.14, 1.0);
}

// Late-afternoon sun behind the viewer's left shoulder, raking across the cliff.
const vec3 SUN_DIR = vec3(-0.5513, 0.6214, 0.5567);

vec3 renderSky(vec3 rd) {
  float elev = clamp(rd.y, 0.0, 1.0);
  vec3 zenith = mix(vec3(0.16, 0.30, 0.52), vec3(0.30, 0.47, 0.70), uVellum);
  vec3 horiz  = mix(vec3(0.74, 0.62, 0.50), vec3(0.93, 0.84, 0.70), uVellum);
  vec3 col = mix(horiz, zenith, pow(elev, 0.52));
  float sunDot = max(0.0, dot(rd, SUN_DIR));
  col += vec3(1.0, 0.72, 0.36) * pow(sunDot, 12.0) * 0.75;
  col += vec3(1.0, 0.94, 0.80) * smoothstep(0.992, 0.9995, sunDot) * 1.8;
  if (rd.y > 0.04) {
    vec2 cuv = rd.xz / (rd.y + 0.15) * 0.12 + vec2(uTime * 0.004, 0.0);
    float cl = texture2D(uTexCliff, cuv).r;
    col = mix(col, vec3(0.96, 0.84, 0.68), smoothstep(0.45, 0.78, cl) * 0.28 * smoothstep(0.04, 0.35, rd.y));
  }
  return col;
}

// Brazier light at the altar nearest to P.
vec3 nearestShrineLight(vec3 P) {
  if (P.z > -850.0)  return vec3(210.0, -90.0, -340.0);
  if (P.z > -1800.0) return vec3(-205.0, -95.0, -1290.0);
  if (P.z > -2750.0) return vec3(205.0, -145.0, -2240.0);
  if (P.z > -3700.0) return vec3(-205.0, -105.0, -3190.0);
  if (P.z > -4650.0) return vec3(0.0, -95.0, -4140.0);
  if (P.z > -5600.0) return vec3(205.0, -90.0, -5090.0);
  if (P.z > -6600.0) return vec3(-205.0, -105.0, -6040.0);
  return vec3(0.0, -90.0, -7040.0);
}

vec3 shadeSurface(vec3 P, vec3 N, vec3 V, float matId, float t, float isReflection) {
  float outsideBlend = smoothstep(-740.0, -540.0, P.z);

  vec3 w = pow(abs(N), vec3(4.0));
  w /= (w.x + w.y + w.z + 0.0001);

  // Two octaves of photographed rock; the micro octave fades out with distance
  // so the far walls resolve to tone instead of aliasing into moire.
  float microFade = 1.0 - smoothstep(500.0, 1400.0, t);
  vec3 cliffMacro = sampleTriplanar(uTexCliff, P, w, 0.0019);
  vec3 cliffMicro = sampleTriplanar(uTexCliff, P + vec3(41.3, 17.9, 89.2), w, 0.0092);
  vec3 cavMacro = sampleTriplanar(uTexCavern, P, w, 0.0023);
  vec3 cavMicro = sampleTriplanar(uTexCavern, P + vec3(63.1, 29.4, 14.7), w, 0.0102);
  vec3 cliffPhoto = mix(cliffMacro, cliffMicro, 0.35 * microFade);
  vec3 cavPhoto = mix(cavMacro, cavMicro, 0.35 * microFade);
  vec3 rawTex = mix(cavPhoto, cliffPhoto, outsideBlend);
  vec3 albedo = pow(max(rawTex, vec3(0.001)), vec3(1.62)) * 1.38;
  float l0 = dot(rawTex, vec3(0.333));
  albedo = mix(vec3(dot(albedo, vec3(0.299, 0.587, 0.114))), albedo, 0.78);

  // Bump from the luminance gradient of the macro octave, close range only.
  vec3 bumpedN = N;
  if (t < 1500.0) {
    float eps = 3.0;
    float sc = mix(0.0023, 0.0019, outsideBlend);
    float lx = dot(mix(sampleTriplanar(uTexCavern, P + vec3(eps, 0.0, 0.0), w, sc), sampleTriplanar(uTexCliff, P + vec3(eps, 0.0, 0.0), w, sc), outsideBlend), vec3(0.333));
    float ly = dot(mix(sampleTriplanar(uTexCavern, P + vec3(0.0, eps, 0.0), w, sc), sampleTriplanar(uTexCliff, P + vec3(0.0, eps, 0.0), w, sc), outsideBlend), vec3(0.333));
    float lz = dot(mix(sampleTriplanar(uTexCavern, P + vec3(0.0, 0.0, eps), w, sc), sampleTriplanar(uTexCliff, P + vec3(0.0, 0.0, eps), w, sc), outsideBlend), vec3(0.333));
    float lm = dot(mix(cavMacro, cliffMacro, outsideBlend), vec3(0.333));
    vec3 g = vec3(lx - lm, ly - lm, lz - lm) / eps;
    g -= N * dot(N, g);
    bumpedN = normalize(N - g * 24.0 * (1.0 - smoothstep(600.0, 1500.0, t)));
  }

  float roughness = clamp(0.32 + (1.0 - l0) * 0.5, 0.2, 0.9);
  vec3 emissive = vec3(0.0);

  if (matId > 1.8 && matId < 2.5) {
    albedo *= vec3(1.16, 0.95, 0.80);
    roughness *= 0.85;
  } else if (matId > 5.5) {
    albedo *= vec3(1.35, 1.08, 0.62);
    roughness = 0.35;
  }

  if (uTrap > 0.5) {
    float vein = smoothstep(0.74, 0.86, 1.0 - l0);
    emissive += vec3(0.7, 0.14, 0.05) * vein * 0.16;
  }
  if (uVellum > 0.5) {
    albedo = mix(albedo, vec3(0.82, 0.74, 0.62), 0.32);
  }

  float ao = calcAO(P, N);

  // Sun outside, with marched cliff shadows.
  float sunDiff = max(0.0, dot(bumpedN, SUN_DIR));
  float sunShadow = (outsideBlend > 0.02 && isReflection < 0.5)
    ? calcSoftShadow(P + N * 3.5, SUN_DIR, 12.0, 780.0, 10.0)
    : 0.45;
  vec3 sunCol = mix(vec3(1.5, 1.12, 0.78), vec3(1.25, 1.08, 0.88), uVellum);
  vec3 skyAmb = mix(vec3(0.26, 0.22, 0.21), vec3(0.52, 0.46, 0.40), uVellum);
  vec3 extLight = skyAmb * (0.5 + 0.5 * bumpedN.y) + sunCol * sunDiff * sunShadow;

  float portalBeam = smoothstep(-1320.0, -620.0, P.z) * smoothstep(230.0, 70.0, abs(P.x));

  // Wall torches every bay, the altar brazier, and a lantern carried by the camera.
  vec3 caveAmb = mix(vec3(0.065, 0.048, 0.038), vec3(0.28, 0.24, 0.20), uVellum);
  float bayZ = floor((P.z + 230.0) / 460.0) * 460.0;
  float fl1 = 0.92 + 0.08 * sin(uTime * 6.8 + bayZ * 0.04);
  float fl2 = 0.92 + 0.08 * cos(uTime * 5.9 - bayZ * 0.05);

  vec3 tL = vec3(-310.0, -10.0, bayZ) - P;
  vec3 tR = vec3( 310.0, -10.0, bayZ) - P;
  float dL = length(tL), dR = length(tR);
  float attL = 1.0 / (1.0 + dL * 0.0024 + dL * dL * 0.000005);
  float attR = 1.0 / (1.0 + dR * 0.0024 + dR * dR * 0.000005);
  float diffL = max(0.0, dot(bumpedN, tL / (dL + 0.001)));
  float diffR = max(0.0, dot(bumpedN, tR / (dR + 0.001)));

  vec3 dS = nearestShrineLight(P) - P;
  float distS = length(dS);
  float attS = 1.0 / (1.0 + distS * 0.0018 + distS * distS * 0.0000032);
  float diffS = max(0.0, dot(bumpedN, dS / (distS + 0.001)));

  vec3 lantern = vec3(uCamPos.x, uCamPos.y + 20.0, uCamPos.z - 110.0);
  vec3 dC = lantern - P;
  float distC = length(dC);
  float attC = 1.0 / (1.0 + distC * 0.0016 + distC * distC * 0.0000022);
  float diffC = max(0.0, dot(bumpedN, dC / (distC + 0.001)));

  vec3 torchHue = (uTrap > 0.5) ? vec3(1.05, 0.52, 0.30) : vec3(1.12, 0.74, 0.42);
  vec3 torchLight = torchHue * ((diffL * 0.75 + 0.25) * attL * fl1 * 1.40 +
                                (diffR * 0.75 + 0.25) * attR * fl2 * 1.40 +
                                (diffS * 0.80 + 0.20) * attS * fl1 * 1.65 +
                                (diffC * 0.70 + 0.30) * attC * 1.15);

  float skyShaft = smoothstep(460.0, 60.0, length(P.xz - vec2(60.0, -2300.0)));
  vec3 skylightCol = vec3(0.95, 0.90, 0.78) * skyShaft * (0.45 + 0.55 * max(0.0, bumpedN.y)) * 1.65;

  float apseDist = length(P - vec3(0.0, 20.0, -7320.0));
  vec3 apseLight = vec3(1.2, 0.9, 0.5) * smoothstep(900.0, 120.0, apseDist) * 0.95;

  float shininess = mix(90.0, 14.0, roughness);
  vec3 hSun = normalize(SUN_DIR + V);
  vec3 hLantern = normalize(dC / (distC + 0.001) + V);
  vec3 hShrine = normalize(dS / (distS + 0.001) + V);
  float spec = pow(max(0.0, dot(bumpedN, hSun)), shininess) * outsideBlend * sunShadow * 0.6 +
               pow(max(0.0, dot(bumpedN, hLantern)), shininess) * attC * 0.7 +
               pow(max(0.0, dot(bumpedN, hShrine)), shininess) * attS * 0.8;
  spec *= (1.0 - roughness * 0.75);
  float rim = pow(1.0 - max(0.0, dot(bumpedN, V)), 3.5) * (0.22 + 0.55 * (attS + outsideBlend * 0.5));

  vec3 caveTotal = caveAmb + torchLight + skylightCol + apseLight + sunCol * portalBeam * 0.85;
  vec3 lighting = mix(caveTotal, extLight + torchLight * 0.25, outsideBlend);

  return albedo * lighting * ao + emissive + vec3(1.0, 0.88, 0.65) * (spec + rim * 0.16);
}

vec3 marchVolumetrics(vec3 ro, vec3 rd, float maxDist) {
  vec3 accum = vec3(0.0);
  float stepLen = min(maxDist, 1850.0) / 12.0;
  float dither = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  for (int i = 0; i < 12; i++) {
    float t = (float(i) + dither) * stepLen;
    if (t > maxDist) break;
    vec3 p = ro + rd * t;
    float extBeam = smoothstep(-620.0, -180.0, p.z) *
                    smoothstep(240.0, -40.0, abs(p.x - p.y * 0.55 - 40.0)) *
                    (0.5 + 0.5 * sin(p.z * 0.018 + p.x * 0.012));
    float portalShaft = smoothstep(-1220.0, -610.0, p.z) * smoothstep(-450.0, -650.0, p.z) *
                        exp(-pow(p.x / 165.0, 2.0)) * exp(-pow((p.y + 40.0) / 185.0, 2.0));
    float skyCone = exp(-pow(length(p.xz - vec2(60.0 + (220.0 - p.y) * 0.18, -2300.0)) / 185.0, 2.0));
    float domeMist = exp(-pow((p.z + 5050.0) / 420.0, 2.0)) * 0.32 +
                     exp(-pow((p.z + 7250.0) / 380.0, 2.0)) * 0.3;
    vec3 beamCol = vec3(1.0, 0.80, 0.44) * (extBeam * 0.35 + portalShaft * 0.95 + domeMist * 0.45) +
                   vec3(0.92, 0.88, 0.76) * skyCone * 0.72;
    accum += beamCol * (stepLen * 0.00058);
  }
  return accum;
}

vec3 acesFilm(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

void main() {
  vec3 ro = vec3(uCamPos.x, uCamPos.y, uCamPos.z);
  vec3 localRay = normalize(vec3(vNDC.x * uAspectFov.x, vNDC.y * uAspectFov.y, -1.0));

  float cr = cos(-uCamAngles.z), sr = sin(-uCamAngles.z);
  vec3 r0 = vec3(localRay.x * cr - localRay.y * sr, localRay.x * sr + localRay.y * cr, localRay.z);
  float cp = cos(-uCamAngles.y), sp = sin(-uCamAngles.y);
  vec3 r1 = vec3(r0.x, r0.y * cp + r0.z * sp, -r0.y * sp + r0.z * cp);
  float cy = cos(uCamAngles.x), sy = sin(uCamAngles.x);
  vec3 rd = normalize(vec3(r1.x * cy - r1.z * sy, r1.y, r1.x * sy + r1.z * cy));

  float t = 16.0;
  float maxDist = 3600.0;
  float hitMat = 0.0;
  bool hit = false;
  for (int i = 0; i < 72; i++) {
    vec3 pos = ro + rd * t;
    if (pos.y > 1100.0 && rd.y > 0.0) { t = maxDist + 10.0; break; }
    vec2 res = mapScene(pos);
    if (res.x < 0.0018 * t) { hitMat = res.y; hit = true; break; }
    t += res.x * 0.82;
    if (t > maxDist) break;
  }

  vec3 col;
  if (!hit) {
    col = (ro.z > -680.0 || rd.y > 0.3) ? renderSky(rd) : mix(vec3(0.03, 0.02, 0.015), vec3(0.75, 0.68, 0.56), uVellum);
    t = min(t, maxDist);
  } else {
    vec3 hitP = ro + rd * t;
    vec3 V = -rd;

    if (hitMat > 4.2 && hitMat < 4.8) {
      float r1w = sin(length(hitP.xz - vec2(60.0, -2300.0)) * 0.12 - uTime * 2.6);
      float r2w = sin(length(hitP.xz - vec2(0.0, -7050.0)) * 0.10 - uTime * 2.1);
      vec3 waterN = normalize(vec3((r1w + r2w) * 0.035, 1.0, (r1w - r2w) * 0.035));
      vec3 reflDir = reflect(rd, waterN);
      float rt = 12.0;
      float rMat = 3.0;
      for (int j = 0; j < 24; j++) {
        vec2 rRes = mapScene(hitP + reflDir * rt);
        if (rRes.x < 2.5 || rt > 1400.0) { rMat = rRes.y; break; }
        rt += rRes.x * 0.9;
      }
      vec3 reflP = hitP + reflDir * rt;
      vec3 reflCol = (rt > 1400.0) ? renderSky(reflDir) : shadeSurface(reflP, calcNormal(reflP, t + rt), -reflDir, rMat, t + rt, 1.0);
      vec3 waterBase = shadeSurface(hitP, waterN, V, 3.0, t, 1.0) * vec3(0.35, 0.48, 0.52);
      float fresnel = 0.22 + 0.72 * pow(1.0 - max(0.0, dot(waterN, V)), 4.0);
      col = mix(waterBase, reflCol, fresnel);
    } else {
      col = shadeSurface(hitP, calcNormal(hitP, t), V, hitMat, t, 0.0);
    }

    float fogAmt = 1.0 - exp(-t * 0.00038);
    vec3 extFog = mix(vec3(0.62, 0.52, 0.44), vec3(0.88, 0.80, 0.68), uVellum);
    vec3 cavFog = mix(vec3(0.035, 0.024, 0.018), vec3(0.76, 0.68, 0.56), uVellum);
    if (uTrap > 0.5) cavFog = vec3(0.06, 0.022, 0.016);
    vec3 fogCol = mix(cavFog, extFog, smoothstep(-780.0, -320.0, ro.z));
    col = mix(col, fogCol, clamp(fogAmt, 0.0, 0.95));
  }

  col += marchVolumetrics(ro, rd, t);

  col = acesFilm(col * 0.92);
  col = pow(col, vec3(0.94));
  float vig = 1.0 - dot(vNDC * 0.42, vNDC * 0.42);
  col *= clamp(vig, 0.68, 1.0);
  // Ordered dither breaks up 8-bit banding in the dark fog.
  col += (fract(sin(dot(gl_FragCoord.xy, vec2(41.7, 289.3))) * 9173.1) - 0.5) / 255.0;

  gl_FragColor = vec4(col, 1.0);
}
`

export const PART_VS = /* glsl */ `
precision highp float;
attribute vec3 aPos;
attribute float aPhase;
attribute float aSpeed;
attribute float aType;
uniform vec3 uCamPos;
uniform vec3 uCamAngles;
uniform vec2 uProjScale;
uniform float uTime;
uniform float uDpr;
varying float vAlpha;
varying float vType;
void main() {
  vType = aType;
  vec3 p = aPos;
  float rise = mod(uTime * aSpeed + aPhase * 80.0, 640.0);
  p.y -= rise;
  if (p.y < -360.0) p.y += 640.0;
  p.x += sin(uTime * 1.2 + aPhase) * 24.0;
  p.z += cos(uTime * 1.0 + aPhase) * 18.0;
  vec3 d = p - uCamPos;
  float cy = cos(uCamAngles.x), sy = sin(uCamAngles.x);
  vec3 r1 = vec3(d.x * cy + d.z * sy, d.y, -d.x * sy + d.z * cy);
  float cp = cos(uCamAngles.y), sp = sin(uCamAngles.y);
  vec3 r2 = vec3(r1.x, r1.y * cp - r1.z * sp, r1.y * sp + r1.z * cp);
  float cr = cos(-uCamAngles.z), sr = sin(-uCamAngles.z);
  vec3 eye = vec3(r2.x * cr - r2.y * sr, r2.x * sr + r2.y * cr, r2.z);
  float depth = -eye.z;
  if (depth < 45.0 || depth > 2800.0) {
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    gl_PointSize = 0.0;
    vAlpha = 0.0;
    return;
  }
  gl_Position = vec4(eye.x * uProjScale.x, -eye.y * uProjScale.y, 0.0, depth);
  float baseSize = (aType > 1.5) ? 7.5 : 4.5;
  gl_PointSize = clamp((baseSize * 850.0 / depth) * uDpr, 1.2, 16.0);
  vAlpha = clamp(1.0 - depth / 2600.0, 0.0, 1.0) * (0.45 + 0.45 * sin(uTime * 2.6 + aPhase));
}
`

export const PART_FS = /* glsl */ `
precision highp float;
varying float vAlpha;
varying float vType;
void main() {
  vec2 c = gl_PointCoord - vec2(0.5);
  float r2 = dot(c, c);
  if (r2 > 0.25) discard;
  float soft = exp(-r2 * 14.0);
  vec3 col = (vType < 0.5) ? vec3(1.0, 0.88, 0.62) : ((vType > 1.5) ? vec3(0.86, 0.78, 0.68) : vec3(1.0, 0.68, 0.30));
  float a = soft * vAlpha * ((vType > 1.5) ? 0.28 : 0.65);
  gl_FragColor = vec4(col * a, a);
}
`
