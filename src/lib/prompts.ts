export const PROMPT_BIOMETRIA_ELDOC = `
Esta es una imagen de un resultado de biometría hemática veterinaria generado por un equipo automatizado. Extrae únicamente los valores numéricos visibles correspondientes a los siguientes analitos y devuélvelos en formato JSON con este formato:

[
  { "nombre": "WBC", "valor": 5.5 },
  { "nombre": "Neu#", "valor": 5.5 },
  ...
]

Los analitos deben aparecer en el siguiente orden exacto, cada uno como un objeto con dos campos:

- "nombre": el nombre del analito, tal cual aparece en esta lista.
- "valor": el valor numérico encontrado. Si no es legible, no está presente o aparece tachado, regresa el valor como null.

Lista completa de analitos esperados (orden estricto):

WBC  
Neu#  
Lym#  
Mon#  
Eos#  
Neu%  
Lym%  
Mon%  
Eos%  
RBC  
HGB  
HCT  
MCV  
MCH  
MCHC  
RDW-CV  
RDW-SD  
PLT  
MPV  
PDW  
PCT  
P-LCC  
P-LCR

⚠️ No expliques nada. No agregues comentarios ni texto adicional. Solo devuelve el JSON.

Ejemplo (si algunos datos faltan):

[
  { "nombre": "WBC", "valor": 5.5 },
  { "nombre": "Neu#", "valor": 3.1 },
  { "nombre": "Lym#", "valor": null },
  ...
]
`.trim();