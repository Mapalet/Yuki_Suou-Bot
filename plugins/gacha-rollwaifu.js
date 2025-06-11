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
        {
            img: 'https://static.wikia.nocookie.net/gearsofwar/images/6/6a/Marcus_Fenix_Gears_5.png',
            name: 'Marcus Fenix',
            gender: 'Masculino',
            value: 'Legendario',
            source: 'Gears of War',
            id: 'gow001',
            user: null
        },
        {
            img: 'https://static.wikia.nocookie.net/gearsofwar/images/7/7f/Anya_Stroud_Gears_5.png',
            name: 'Anya Stroud',
            gender: 'Femenino',
            value: 'Épico',
            source: 'Gears of War',
            id: 'gow002',
            user: null
        }
    ],
    subnautica: [
        {
            img: 'https://static.wikia.nocookie.net/subnautica/images/7/7a/Seamoth_Model.png',
            name: 'Seamoth',
            gender: 'N/A',
            value: 'Vehículo',
            source: 'Subnautica',
            id: 'sub001',
            user: null
        },
        {
            img: 'https://static.wikia.nocookie.net/subnautica/images/8/8d/Peeper_Model.png',
            name: 'Peeper',
            gender: 'N/A',
            value: 'Criatura',
            source: 'Subnautica',
            id: 'sub002',
            user: null
        }
    ],
    warhammer_40k: [
        {
            img: 'https://www.games-workshop.com/resources/catalog/product/920x950/99120199015_SpaceMarinePrimarisLieutenant01.jpg',
            name: 'Space Marine',
            gender: 'Masculino',
            value: 'Legendario',
            source: 'Warhammer 40k',
            id: 'wh40k001',
            user: null
        },
        {
            img: 'https://www.games-workshop.com/resources/catalog/product/920x950/99120199043_EldarFarseer01.jpg',
            name: 'Eldar Farseer',
            gender: 'Femenino',
            value: 'Épico',
            source: 'Warhammer 40k',
            id: 'wh40k002',
            user: null
        }
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
                                                                                  
