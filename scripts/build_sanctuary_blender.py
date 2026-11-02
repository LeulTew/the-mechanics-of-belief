"""
Blender 5.2 Headless Sanctuary 3D Specimen Generator
The Mechanics of Belief — Ethiopian Monolithic Sanctuary & Reliquaries
"""
import bpy
import bmesh
import math
import os
import sys
from mathutils import Vector, Matrix

# Parse output path
argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
out_file = argv[0] if argv else "public/models/sanctuary_specimens.glb"
os.makedirs(os.path.dirname(os.path.abspath(out_file)), exist_ok=True)

# Clean scene
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
col = bpy.data.collections.new("SanctuarySpecimens")
scene.collection.children.link(col)

def create_mat(name, color, roughness=0.7, metallic=0.1):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    bsdf = nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs['Base Color'].default_value = (*color, 1.0)
        bsdf.inputs['Roughness'].default_value = roughness
        bsdf.inputs['Metallic'].default_value = metallic
    return mat

stone_mat = create_mat("MonolithicStone", (0.55, 0.42, 0.32), roughness=0.88, metallic=0.0)
bronze_mat = create_mat("LiturgyBronze", (0.82, 0.65, 0.38), roughness=0.35, metallic=0.85)
gold_mat = create_mat("SanctuaryGold", (0.95, 0.78, 0.35), roughness=0.25, metallic=0.92)

# --- SPECIMEN 1: Bet Giyorgis Monolithic Cross ---
bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 0))
cube_center = bpy.context.active_object
cube_center.name = "BetGiyorgis_Center"
cube_center.scale = (0.5, 0.5, 0.25)
bpy.ops.object.transform_apply(scale=True)

# 4 Cross Arms
for dx, dy in [(0.75, 0), (-0.75, 0), (0, 0.75), (0, -0.75)]:
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(dx, dy, 0))
    arm = bpy.context.active_object
    arm.scale = (0.5, 0.5, 0.25) if dx == 0 else (0.5, 0.5, 0.25)
    bpy.ops.object.transform_apply(scale=True)
    # Join with center
    cube_center.select_set(True)
    arm.select_set(True)
    bpy.context.view_layer.objects.active = cube_center
    bpy.ops.object.join()

cross_obj = bpy.context.active_object
cross_obj.name = "BetGiyorgisCross"
cross_obj.data.materials.append(stone_mat)

# --- SPECIMEN 2: Aksumite Obelisk Stele ---
bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.35, depth=2.8, location=(3.0, 0, 0))
stele = bpy.context.active_object
stele.name = "AksumiteObelisk"
stele.scale = (0.7, 0.4, 1.0)
bpy.ops.object.transform_apply(scale=True)
# Add apex finial disc
bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=0.28, depth=0.08, location=(3.0, 0, 1.45))
apex = bpy.context.active_object
apex.rotation_euler = (math.radians(90), 0, 0)
bpy.ops.object.transform_apply(rotation=True)
stele.select_set(True)
apex.select_set(True)
bpy.context.view_layer.objects.active = stele
bpy.ops.object.join()
stele.data.materials.append(stone_mat)

# --- SPECIMEN 3: Tsenatsel Bronze Sistrum ---
# Handle
bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=0.06, depth=1.2, location=(-3.0, 0, -0.4))
handle = bpy.context.active_object
handle.name = "TsenatselSistrum"
# Arch frame
bpy.ops.mesh.primitive_torus_add(major_radius=0.45, minor_radius=0.04, location=(-3.0, 0, 0.5))
arch = bpy.context.active_object
arch.scale = (1.0, 0.3, 1.3)
bpy.ops.object.transform_apply(scale=True)
# Chime Crossbars & Jingles
for b_z in [0.35, 0.55, 0.75]:
    bpy.ops.mesh.primitive_cylinder_add(vertices=8, radius=0.02, depth=0.8, location=(-3.0, 0, b_z))
    cbar = bpy.context.active_object
    cbar.rotation_euler = (0, math.radians(90), 0)
    bpy.ops.object.transform_apply(rotation=True)
    # 2 Jingles on bar
    for j_x in [-3.18, -2.82]:
        bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=0.08, depth=0.02, location=(j_x, 0, b_z))
        jingle = bpy.context.active_object
        handle.select_set(True)
        jingle.select_set(True)
        bpy.context.view_layer.objects.active = handle
        bpy.ops.object.join()
    handle.select_set(True)
    cbar.select_set(True)
    bpy.context.view_layer.objects.active = handle
    bpy.ops.object.join()

handle.select_set(True)
arch.select_set(True)
bpy.context.view_layer.objects.active = handle
bpy.ops.object.join()
handle.data.materials.append(bronze_mat)

# Export all to GLTF / GLB
bpy.ops.object.select_all(action='SELECT')
print(f"Exporting sanctuary specimens to {out_file}...")
bpy.ops.export_scene.gltf(
    filepath=out_file,
    export_format='GLB',
    use_selection=True,
    export_apply=True
)
print("Blender GLB export successfully completed!")
