const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\alcsilva\\Downloads\\contatos';
const files = fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith('.vcf'));

console.log(`Iniciando importação de ${files.length} arquivos VCF...`);

function decodeQuotedPrintable(str) {
  if (!str) return '';
  str = str.replace(/=\r?\n\s*/g, '');
  if (!str.includes('=')) return str;
  try {
    const bytes = [];
    for (let i = 0; i < str.length; i++) {
      if (str[i] === '=' && i + 2 < str.length) {
        const hex = str.substring(i + 1, i + 3);
        if (/^[0-9A-Fa-f]{2}$/.test(hex)) {
          bytes.push(parseInt(hex, 16));
          i += 2;
          continue;
        }
      }
      bytes.push(str.charCodeAt(i));
    }
    return Buffer.from(bytes).toString('utf8');
  } catch (e) {
    return str;
  }
}

function extractInstagram(text) {
  if (!text) return '';
  const regex = /@([a-zA-Z0-9_\.]+)/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    let handle = match[1];
    handle = handle.replace(/\.vcf$/i, '').replace(/\.$/, '');
    const lower = handle.toLowerCase();
    if (['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'icloud.com', 'bol.com.br', 'vcf'].includes(lower)) continue;
    if (handle.length >= 3) return '@' + handle;
  }
  return '';
}

function parseVCard(fileContent, filename) {
  const unfolded = fileContent.replace(/\r?\n[ \t]/g, '');
  const lines = unfolded.split(/\r?\n/);
  
  let fn = '';
  let org = '';
  let title = '';
  let phones = [];
  let emails = [];
  let waDesc = '';
  let waName = '';
  let note = '';

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;

    const rawKey = line.substring(0, colonIdx);
    let val = line.substring(colonIdx + 1);

    if (rawKey.toUpperCase().includes('QUOTED-PRINTABLE')) {
      val = decodeQuotedPrintable(val);
    }

    const keyUpper = rawKey.toUpperCase();

    if (keyUpper.startsWith('FN')) {
      fn = val;
    } else if (keyUpper.startsWith('N;') || keyUpper === 'N') {
      if (!fn) {
        const parts = val.split(';').filter(Boolean);
        fn = parts.reverse().join(' ');
      }
    } else if (keyUpper.startsWith('ORG')) {
      org = val.replace(/;/g, ' ').trim();
    } else if (keyUpper.startsWith('TITLE')) {
      title = val;
    } else if (keyUpper.includes('TEL')) {
      if (val) phones.push(val);
    } else if (keyUpper.includes('EMAIL')) {
      if (val) emails.push(val);
    } else if (keyUpper.includes('X-WA-BIZ-DESCRIPTION')) {
      waDesc = val;
    } else if (keyUpper.includes('X-WA-BIZ-NAME')) {
      waName = val;
    } else if (keyUpper.startsWith('NOTE')) {
      note = val;
    }
  }

  if (!fn || fn.trim() === '') {
    fn = filename.replace(/\.vcf$/i, '');
  }

  const cleanPhones = [];
  const waLinks = [];

  for (let p of phones) {
    let digits = p.replace(/\D/g, '');
    if (!digits) continue;
    
    let waDigits = digits;
    if (digits.length === 10 || digits.length === 11) {
      waDigits = '55' + digits;
    }

    let formatted = p;
    if (digits.length === 11 && digits.startsWith('55')) {
      const ddd = digits.substring(2, 4);
      const num = digits.substring(4);
      formatted = `(${ddd}) ${num.substring(0, 5)}-${num.substring(5)}`;
    } else if (digits.length === 13 && digits.startsWith('55')) {
      const ddd = digits.substring(2, 4);
      const num = digits.substring(4);
      formatted = `+55 (${ddd}) ${num.substring(0, 5)}-${num.substring(5)}`;
    } else if (digits.length === 11) {
      const ddd = digits.substring(0, 2);
      const num = digits.substring(2);
      formatted = `(${ddd}) ${num.substring(0, 5)}-${num.substring(5)}`;
    }

    cleanPhones.push(formatted);
    waLinks.push(`https://wa.me/${waDigits}`);
  }

  const fullText = filename + ' ' + fn + ' ' + org + ' ' + waDesc + ' ' + note;
  const instagram = extractInstagram(fullText);

  return {
    filename,
    name: fn.trim(),
    org: (org || waName || '').trim(),
    title: title.trim(),
    phones: cleanPhones,
    phone_primary: cleanPhones[0] || '',
    wa_link: waLinks[0] || '',
    email: emails[0] || '',
    wa_description: waDesc.trim(),
    note: note.trim(),
    instagram: instagram,
    rating: 0
  };
}

const categoryRules = [
  { name: 'Climatização & Refrigeração', keywords: ['ar condicionado', 'refrigera', 'geladeira', 'split', 'clima', 'freezer', 'boiller', 'aquecedor'] },
  { name: 'Elétrica & Eletrônica', keywords: ['eletric', 'eletrec', 'eletronica', 'eletrônica', 'tomada', 'câmera', 'camera', 'tv', 'luz', 'iluminação'] },
  { name: 'Construção & Reformas', keywords: ['pedreiro', 'marceneiro', 'marcenaria', 'pintor', 'gesso', 'vidraceiro', 'vidro', 'serralhe', 'esquadria', 'obra', 'reforma', 'granito', 'mármore', 'marmore', 'piso', 'arquitet', 'engenhar'] },
  { name: 'Serviços Domésticos & Manutenção', keywords: ['diaria', 'diarista', 'faxina', 'passadeira', 'limpeza', 'sofá', 'sofa', 'dedetiza', 'detetiza', 'bombeiro', 'encanador', 'chaveiro', 'desentupidora', 'cuidador', 'babá', 'baba', 'reparos', 'conserto'] },
  { name: 'Saúde & Médicos', keywords: ['dentista', 'médic', 'medic', 'doutor', 'dra.', 'dr.', 'dra ', 'dr ', 'clínica', 'clinica', 'odontolog', 'fisioterap', 'fono', 'psicól', 'psicol', 'geriatra', 'pneumo', 'dermato', 'endocrino', 'pediatra', 'podólog', 'podolog', 'ortoped', 'hospital', 'farmácia', 'farmacia', 'nutri', 'terapeuta'] },
  { name: 'Gastronomia, Alimentos & Festas', keywords: ['buffet', 'bolo', 'doce', 'confeit', 'salgado', 'cerveja', 'bar', 'restaurante', 'pizzar', 'coxinha', 'empada', 'café', 'cafe', 'lanch', 'churrasc', 'garçom', 'festa', 'balão', 'balao', 'marmita', 'comida', 'peixaria', 'açougu', 'acougu', 'frutas', 'ovos', 'queijo', 'bebida', 'rotisseria', 'padaria', 'cerimonial'] },
  { name: 'Fretes, Mudanças & Veículos', keywords: ['frete', 'mudança', 'mudanca', 'uber', 'motorista', 'borrachar', 'mecânic', 'mecanic', 'carro', 'auto', 'insulfilm', 'bateria', 'pneu', 'oficina', 'veículo', 'veiculo', 'transporte', 'reboque'] },
  { name: 'Pet & Veterinária', keywords: ['pet', 'veterinár', 'veterinar', 'vet', 'canil', 'tosa', 'banho', 'cachorro', 'gato', 'ração', 'racao', 'animal'] },
  { name: 'Beleza & Cuidados Pessoais', keywords: ['salão', 'salao', 'manicure', 'sobrancelha', 'cabelo', 'maquiad', 'barbearia', 'barbeiro', 'unha', 'estétic', 'estetic', 'depila', 'massag', 'podologia'] },
  { name: 'Tecnologia & Informática', keywords: ['informática', 'informatica', 'computador', 'notebook', 'manutenção', 'suporte', 'tecnologia', 'cartucho', 'impressora', 'internet', 'site', 'software'] },
  { name: 'Costura, Estofados & Decoração', keywords: ['costura', 'costureira', 'roupa', 'bordado', 'ateliê', 'atelie', 'uniforme', 'cortina', 'persiana', 'estofad', 'papel de parede', 'decora', 'moldura', 'toldo'] }
];

function getCategory(item, filename) {
  const contentToSearch = (filename + ' ' + item.name + ' ' + item.org + ' ' + item.title + ' ' + item.wa_description + ' ' + item.note)
    .replace(/X-ABLabel:Celular/gi, '')
    .replace(/TYPE=CELL/gi, '')
    .toLowerCase();

  for (const rule of categoryRules) {
    if (rule.keywords.some(kw => contentToSearch.includes(kw))) {
      return rule.name;
    }
  }
  return 'Outros / Gerais';
}

const contacts = [];

for (const f of files) {
  try {
    const content = fs.readFileSync(path.join(dir, f), 'utf8');
    const parsed = parseVCard(content, f);
    parsed.category = getCategory(parsed, f);
    contacts.push(parsed);
  } catch (err) {
    console.error(`Erro ao ler ${f}:`, err.message);
  }
}

contacts.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

fs.writeFileSync(path.join(dir, 'catalogo_contatos.json'), JSON.stringify(contacts, null, 2), 'utf8');

const csvHeader = 'Nome;Empresa;Categoria;Avaliacao;Telefone;Instagram;WhatsApp Link;Email;Descrição WhatsApp;Notas\n';
const csvRows = contacts.map(c => {
  const escapeCsv = (str) => `"${(str || '').replace(/"/g, '""')}"`;
  return [
    escapeCsv(c.name),
    escapeCsv(c.org),
    escapeCsv(c.category),
    escapeCsv(c.rating ? c.rating.toString() : ''),
    escapeCsv(c.phone_primary),
    escapeCsv(c.instagram),
    escapeCsv(c.wa_link),
    escapeCsv(c.email),
    escapeCsv(c.wa_description),
    escapeCsv(c.note)
  ].join(';');
});

fs.writeFileSync(path.join(dir, 'catalogo_contatos.csv'), '\uFEFF' + csvHeader + csvRows.join('\n'), 'utf8');

console.log(`Importação concluída! Total de contatos importados: ${contacts.length}`);
