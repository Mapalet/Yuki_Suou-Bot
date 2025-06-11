import { promises as fs } from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'

const charactersFilePath = './src/database/characters.json'
const haremFilePath = './src/database/harem.json'
const cacheDir = './src/database/cache/'

const cooldowns = {}

async function loadCharacters() {
    try {
        const data = await fs.readFile(charactersFilePath, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        throw new Error('❀ No se pudo cargar el archivo characters.json.')
    }
}

async function saveCharacters(characters) {
    try {
        await fs.writeFile(charactersFilePath, JSON.stringify(characters, null, 2), 'utf-8')
    } catch (error) {
        throw new Error('❀ No se pudo guardar el archivo characters.json.')
    }
}

async function loadHarem() {
    try {
        const data = await fs.readFile(haremFilePath, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        return []
    }
}

async function saveHarem(harem) {
    try {
        await fs.writeFile(haremFilePath, JSON.stringify(harem, null, 2), 'utf-8')
    } catch (error) {
        throw new Error('❀ No se pudo guardar el archivo harem.json.')
    }
}

async function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath)
        const client = url.startsWith('https') ? https : http
        client.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to get '${url}' (${response.statusCode})`))
                return
            }
            response.pipe(file)
            file.on('finish', () => {
                file.close(resolve)
            })
        }).on('error', (err) => {
            fs.unlink(filepath).catch(() => {})
            reject(err)
        })
    })
}

const specialCategories = {
  gears_of_war: [
    { id: 'gow001', name: 'Marcus Fenix', gender: 'Masculino', value: 'Legendario', source: 'Gears of War', user: null, img: 'https://static.wikia.nocookie.net/gearsofwar/images/6/6a/Marcus_Fenix_Gears_5.png' },
    { id: 'gow002', name: 'Anya Stroud', gender: 'Femenino', value: 'Épico', source: 'Gears of War', user: null, img: 'https://static.wikia.nocookie.net/gearsofwar/images/7/7f/Anya_Stroud_Gears_5.png' },
    { id: 'gow003', name: 'Dominic Santiago', gender: 'Masculino', value: 'Legendario', source: 'Gears of War', user: null, img: 'https://static.wikia.nocookie.net/gearsofwar/images/0/06/Dom_Santiago_Gears_5.png' },
    { id: 'gow004', name: 'Augustus Cole', gender: 'Masculino', value: 'Épico', source: 'Gears of War', user: null, img: 'https://static.wikia.nocookie.net/gearsofwar/images/2/2e/Augustus_Cole_Gears_5.png' },
    { id: 'gow005', name: 'Damon Baird', gender: 'Masculino', value: 'Raro', source: 'Gears of War', user: null, img: 'https://static.wikia.nocookie.net/gearsofwar/images/9/9a/Damon_Baird_Gears_5.png' },
    { id: 'gow006', name: 'Clayton Carmine', gender: 'Masculino', value: 'Raro', source: 'Gears of War', user: null, img: 'https://static.wikia.nocookie.net/gearsofwar/images/5/5f/Clayton_Carmine_Gears_5.png' },
    { id: 'gow007', name: 'Tai Kaliso', gender: 'Masculino', value: 'Raro', source: 'Gears of War', user: null, img: 'https://static.wikia.nocookie.net/gearsofwar/images/7/7a/Tai_Kaliso_Gears_5.png' },
    { id: 'gow008', name: 'General RAAM', gender: 'Masculino', value: 'Legendario', source: 'Gears of War', user: null, img: 'https://static.wikia.nocookie.net/gearsofwar/images/9/9d/General_RAAM_Gears_5.png' },
    { id: 'gow009', name: 'Jace Stratton', gender: 'Masculino', value: 'Raro', source: 'Gears of War', user: null, img: 'https://static.wikia.nocookie.net/gearsofwar/images/0/0a/Jace_Stratton_Gears_5.png' },
    { id: 'gow010', name: 'Del Walker', gender: 'Masculino', value: 'Raro', source: 'Gears of War', user: null, img: 'https://static.wikia.nocookie.net/gearsofwar/images/8/8c/Del_Walker_Gears_5.png' },
    { id: 'gow011', name: 'Lizzie Carmine', gender: 'Femenino', value: 'Raro', source: 'Gears of War', user: null, img: 'https://static.wikia.nocookie.net/gearsofwar/images/3/3b/Lizzie_Carmine_Gears_5.png' },
    { id: 'gow012', name: 'Paduk', gender: 'Masculino', value: 'Raro', source: 'Gears of War', user: null, img: 'https://static.wikia.nocookie.net/gearsofwar/images/4/4d/Paduk_Gears_5.png' },
    { id: 'gow013', name: 'Cole Train', gender: 'Masculino', value: 'Épico', source: 'Gears of War', user: null, img: 'https://static.wikia.nocookie.net/gearsofwar/images/f/f0/Augustus_Cole_Gears_5.png' },
    { id: 'gow014', name: 'Oscar Diaz', gender: 'Masculino', value: 'Raro', source: 'Gears of War', user: null, img: 'https://static.wikia.nocookie.net/gearsofwar/images/7/7e/Oscar_Diaz_Gears_5.png' },
    { id: 'gow015', name: 'Kait Diaz', gender: 'Femenino', value: 'Legendario', source: 'Gears of War', user: null, img: 'https://static.wikia.nocookie.net/gearsofwar/images/5/5e/Kait_Diaz_Gears_5.png' },
    { id: 'gow016', name: 'JD Fenix', gender: 'Masculino', value: 'Legendario', source: 'Gears of War', user: null, img: 'https://static.wikia.nocookie.net/gearsofwar/images/3/3b/JD_Fenix_Gears_5.png' },
    { id: 'gow017', name: 'Marcus Phoenix', gender: 'Masculino', value: 'Legendario', source: 'Gears of War', user: null, img: 'https://static.wikia.nocookie.net/gearsofwar/images/6/6a/Marcus_Fenix_Gears_5.png' },
    { id: 'gow018', name: 'Anya Stroud', gender: 'Femenino', value: 'Épico', source: 'Gears of War', user: null, img: 'https://static.wikia.nocookie.net/gearsofwar/images/7/7f/Anya_Stroud_Gears_5.png' },
    { id: 'gow019', name: 'Damon Baird', gender: 'Masculino', value: 'Raro', source: 'Gears of War', user: null, img: 'https://static.wikia.nocookie.net/gearsofwar/images/9/9a/Damon_Baird_Gears_5.png' },
    { id: 'gow020', name: 'Cole Train', gender: 'Masculino', value: 'Épico', source: 'Gears of War', user: null, img: 'https://static.wikia.nocookie.net/gearsofwar/images/f/f0/Augustus_Cole_Gears_5.png' }
  ],
  subnautica: [
    { id: 'sub001', name: 'Seamoth', gender: 'N/A', value: 'Vehículo', source: 'Subnautica', user: null, img: 'https://static.wikia.nocookie.net/subnautica/images/7/7a/Seamoth_Model.png' },
    { id: 'sub002', name: 'Peeper', gender: 'N/A', value: 'Criatura', source: 'Subnautica', user: null, img: 'https://static.wikia.nocookie.net/subnautica/images/8/8d/Peeper_Model.png' },
    { id: 'sub003', name: 'Reefback', gender: 'N/A', value: 'Criatura gigante', source: 'Subnautica', user: null, img: 'https://static.wikia.nocookie.net/subnautica/images/7/7a/Reefback_Model.png' },
    { id: 'sub004', name: 'Ghost Leviathan', gender: 'N/A', value: 'Criatura', source: 'Subnautica', user: null, img: 'https://static.wikia.nocookie.net/subnautica/images/5/5a/Ghost_Leviathan_Model.png' },
    { id: 'sub005', name: 'Stalker', gender: 'N/A', value: 'Criatura', source: 'Subnautica', user: null, img: 'https://static.wikia.nocookie.net/subnautica/images/3/3c/Stalker_Model.png' },
    { id: 'sub006', name: 'Crabsquid', gender: 'N/A', value: 'Criatura', source: 'Subnautica', user: null, img: 'https://static.wikia.nocookie.net/subnautica/images/7/7f/Crabsquid_Model.png' },
    { id: 'sub007', name: 'Sea Dragon Leviathan', gender: 'N/A', value: 'Criatura', source: 'Subnautica', user: null, img: 'https://static.wikia.nocookie.net/subnautica/images/3/3a/Sea_Dragon_Leviathan_Model.png' },
    { id: 'sub008', name: 'Reaper Leviathan', gender: 'N/A', value: 'Criatura', source: 'Subnautica', user: null, img: 'https://static.wikia.nocookie.net/subnautica/images/4/4a/Reaper_Leviathan_Model.png' },
    { id: 'sub009', name: 'Cave Crawler', gender: 'N/A', value: 'Criatura', source: 'Subnautica', user: null, img: 'https://static.wikia.nocookie.net/subnautica/images/6/6a/Cave_Crawler_Model.png' },
    { id: 'sub010', name: 'Gasopod', gender: 'N/A', value: 'Criatura', source: 'Subnautica', user: null, img: 'https://static.wikia.nocookie.net/subnautica/images/9/9e/Gasopod_Model.png' },
    { id: 'sub011', name: 'Bleeder', gender: 'N/A', value: 'Criatura', source: 'Subnautica', user: null, img: 'https://static.wikia.nocookie.net/subnautica/images/6/6e/Bleeder_Model.png' },
    { id: 'sub012', name: 'Hoverfish', gender: 'N/A', value: 'Criatura', source: 'Subnautica', user: null, img: 'https://static.wikia.nocookie.net/subnautica/images/3/3c/Hoverfish_Model.png' },
    { id: 'sub013', name: 'Holefish', gender: 'N/A', value: 'Criatura', source: 'Subnautica', user: null, img: 'https://static.wikia.nocookie.net/subnautica/images/1/1f/Holefish_Model.png' },
    { id: 'sub014', name: 'Jellyray', gender: 'N/A', value: 'Criatura', source: 'Subnautica', user: null, img: 'https://static.wikia.nocookie.net/subnautica/images/0/0d/Jellyray_Model.png' },
    { id: 'sub015', name: 'Mesmer', gender: 'N/A', value: 'Criatura', source: 'Subnautica', user: null, img: 'https://static.wikia.nocookie.net/subnautica/images/4/4b/Mesmer_Model.png' },
    { id: 'sub016', name: 'Sand Shark', gender: 'N/A', value: 'Criatura', source: 'Subnautica', user: null, img: 'https://static.wikia.nocookie.net/subnautica/images/6/6f/Sandshark_Model.png' },
    { id: 'sub017', name: 'Spadefish', gender: 'N/A', value: 'Criatura', source: 'Subnautica', user: null, img: 'https://static.wikia.nocookie.net/subnautica/images/0/0e/Spadefish_Model.png' },
    { id: 'sub018', name: 'Spinefish', gender: 'N/A', value: 'Criatura', source: 'Subnautica', user: null, img: 'https://static.wikia.nocookie.net/subnautica/images/9/97/Spinefish_Model.png' },
    { id: 'sub019', name: 'Stalker', gender: 'N/A', value: 'Criatura', source: 'Subnautica', user: null, img: 'https://static.wikia.nocookie.net/subnautica/images/3/3c/Stalker_Model.png' },
    { id: 'sub020', name: 'Hoverfish', gender: 'N/A', value: 'Criatura', source: 'Subnautica', user: null, img: 'https://static.wikia.nocookie.net/subnautica/images/3/3c/Hoverfish_Model.png' }
  ],
  warhammer_40k: [
    { id: 'wh40k001', name: 'El Emperador de la Humanidad', gender: 'Masculino', value: 'Legendario', source: 'Warhammer 40k', user: null, img: 'https://vignette.wikia.nocookie.net/warhammer40k/images/7/7a/The_Emperor_of_Mankind.jpg' },
    { id: 'wh40k002', name: 'Roboute Guilliman', gender: 'Masculino', value: 'Legendario', source: 'Warhammer 40k', user: null, img: 'https://vignette.wikia.nocookie.net/warhammer40k/images/9/9b/Roboute_Guilliman.jpg' },
    { id: 'wh40k003', name: 'Magnus el Rojo', gender: 'Masculino', value: 'Legendario', source: 'Warhammer 40k', user: null, img: 'https://vignette.wikia.nocookie.net/warhammer40k/images/4/4a/Magnus_the_Red.jpg' },
    { id: 'wh40k004', name: 'Dante', gender: 'Masculino', value: 'Legendario', source: 'Warhammer 40k', user: null, img: 'https://vignette.wikia.nocookie.net/warhammer40k/images/4/4a/Dante_Sanguinius.jpg' },
    { id: 'wh40k005', name: 'Abaddon el Saqueador', gender: 'Masculino', value: 'Legendario', source: 'Warhammer 40k', user: null, img: 'https://vignette.wikia.nocookie.net/warhammer40k/images/0/0f/Abaddon_the_Despoiler.jpg' },
    { id: 'wh40k006', name: 'Saint Celestine', gender: 'Femenino', value: 'Legendario', source: 'Warhammer 40k', user: null, img: 'https://vignette.wikia.nocookie.net/warhammer40k/images/5/5c/Saint_Celestine.jpg' },
    { id: 'wh40k007', name: 'Eldrad Ulthran', gender: 'Masculino', value: 'Legendario', source: 'Warhammer 40k', user: null, img: 'https://vignette.wikia.nocookie.net/warhammer40k/images/1/1f/Eldrad_Ulthran.jpg' },
    { id: 'wh40k008', name: 'Ghazghkull Thraka', gender: 'Masculino', value: 'Legendario', source: 'Warhammer 40k', user: null, img: 'https://vignette.wikia.nocookie.net/warhammer40k/images/9/9f/Ghazghkull_Thraka.jpg' },
    { id: 'wh40k009', name: 'Logan Grimnar', gender: 'Masculino', value: 'Legendario', source: 'Warhammer 40k', user: null, img: 'https://vignette.wikia.nocookie.net/warhammer40k/images/8/8e/Logan_Grimnar.jpg' },
    { id: 'wh40k010', name: 'Comisario Yarrick', gender: 'Masculino', value: 'Legendario', source: 'Warhammer 40k', user: null, img: 'https://vignette.wikia.nocookie.net/warhammer40k/images/3/3b/Yarrick.jpg' },
    { id: 'wh40k011', name: 'Khan', gender: 'Masculino', value: 'Legendario', source: 'Warhammer 40k', user: null, img: 'https://vignette.wikia.nocookie.net/warhammer40k/images/2/2f/Jaghatai_Khan.jpg' },
    { id: 'wh40k012', name: 'Mephiston', gender: 'Masculino', value: 'Legendario', source: 'Warhammer 40k', user: null, img: 'https://vignette.wikia.nocookie.net/warhammer40k/images/7/7a/Mephiston.jpg' },
    { id: 'wh40k013', name: 'Marneus Calgar', gender: 'Masculino', value: 'Legendario', source: 'Warhammer 40k', user: null, img: 'https://vignette.wikia.nocookie.net/warhammer40k/images/4/4e/Marneus_Calgar.jpg' },
    { id: 'wh40k014', name: 'Farseer Eldar', gender: 'Femenino', value: 'Legendario', source: 'Warhammer 40k', user: null, img: 'https://vignette.wikia.nocookie.net/warhammer40k/images/1/1f/Eldar_Farseer.jpg' },
    { id: 'wh40k015', name: 'Typhus', gender: 'Masculino', value: 'Legendario', source: 'Warhammer 40k', user: null, img: 'https://vignette.wikia.nocookie.net/warhammer40k/images/6/6a/Typhus.jpg' },
    { id: 'wh40k016', name: 'Kharn the Betrayer', gender: 'Masculino', value: 'Legendario', source: 'Warhammer 40k', user: null, img: 'https://vignette.wikia.nocookie.net/warhammer40k/images/3/3f/Kharn_the_Betrayer.jpg' },
    { id: 'wh40k017', name: 'Belisarius Cawl', gender: 'Masculino', value: 'Legendario', source: 'Warhammer 40k', user: null, img: 'https://vignette.wikia.nocookie.net/warhammer40k/images/6/6c/Belisarius_Cawl.jpg' },
    { id: 'wh40k018', name: 'Magnus the Red', gender: 'Masculino', value: 'Legendario', source: 'Warhammer 40k', user: null, img: 'https://vignette.wikia.nocookie.net/warhammer40k/images/4/4a/Magnus_the_Red.jpg' },
    { id: 'wh40k019', name: 'Sanguinius', gender: 'Masculino', value: 'Legendario', source: 'Warhammer 40k', user: null, img: 'https://vignette.wikia.nocookie.net/warhammer40k/images/2/2a/Sanguinius.jpg' },
    { id: 'wh40k020', name: 'Konrad Curze', gender: 'Masculino', value: 'Legendario', source: 'Warhammer 40k', user: null, img: 'https://vignette.wikia.nocookie.net/warhammer40k/images/0/0a/Konrad_Curze.jpg' }
  ]
}

function getRandomSpecialCharacter(category) {
    const list = specialCategories[category]
    return list[Math.floor(Math.random() * list.length)]
}

function getRandomCategory() {
    const rand = Math.random()
    if (rand < 0.10) return 'gears_of_war'
    else if (rand < 0.30) return 'subnautica'
    else if (rand < 0.50) return 'warhammer_40k'
    else return 'default'
}

async function getCachedImagePath(url, id) {
    await fs.mkdir(cacheDir, { recursive: true })
    const filename = `${id}.jpg`
    const filepath = path.join(cacheDir, filename)
    try {
        await fs.access(filepath)
        return filepath
    } catch {
        await downloadImage(url, filepath)
        return filepath
    }
}

let handler = async (m, { conn }) => {
    const userId = m.sender
    const now = Date.now()

    if (cooldowns[userId] && now < cooldowns[userId]) {
        const remainingTime = Math.ceil((cooldowns[userId] - now) / 1000)
        const minutes = Math.floor(remainingTime / 60)
        const seconds = remainingTime % 60
        return await conn.reply(m.chat, `《✧》Debes esperar *${minutes} minutos y ${seconds} segundos* para usar *#rw* de nuevo.`, m)
    }

    try {
        const category = getRandomCategory()

        if (category === 'default') {
            const characters = await loadCharacters()
            const randomCharacter = characters[Math.floor(Math.random() * characters.length)]
            const randomImage = randomCharacter.img[Math.floor(Math.random() * randomCharacter.img.length)]

            const harem = await loadHarem()
            const userEntry = harem.find(entry => entry.characterId === randomCharacter.id)
            const statusMessage = randomCharacter.user
                ? `Reclamado por @${randomCharacter.user.split('@')[0]}`
                : 'Libre'

            const message = `❀ Nombre » *${randomCharacter.name}*
⚥ Género » *${randomCharacter.gender}*
✰ Valor » *${randomCharacter.value}*
♡ Estado » ${statusMessage}
❖ Fuente » *${randomCharacter.source}*
✦ ID: *${randomCharacter.id}*`

            const mentions = userEntry ? [userEntry.userId] : []

            await conn.sendFile(m.chat, randomImage, `${randomCharacter.name}.jpg`, message, m, { mentions })

            if (!randomCharacter.user) {
                await saveCharacters(characters)
            }

        } else {
            const specialChar = getRandomSpecialCharacter(category)
            const cachedImagePath = await getCachedImagePath(specialChar.img, specialChar.id)

            const message = `❀ Nombre » *${specialChar.name}*
⚥ Género » *${specialChar.gender}*
✰ Valor » *${specialChar.value}*
❖ Fuente » *${specialChar.source}*
✦ ID: *${specialChar.id}*`

            await conn.sendFile(m.chat, cachedImagePath, `${specialChar.name}.jpg`, message, m)
        }

        cooldowns[userId] = now + 15 * 60 * 1000

    } catch (error) {
        await conn.reply(m.chat, `✘ Error al cargar el personaje: ${error.message}`, m)
    }
}

handler.help = ['ver', 'rw', 'rollwaifu']
handler.tags = ['gacha']
handler.command = ['ver', 'rw', 'rollwaifu']
handler.group = true

export default handler
