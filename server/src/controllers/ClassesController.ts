import {Request, Response} from 'express'
import db from '../database/connection'

import convertHourToMinutes from '../utils/convertHourToMinutes'

interface ScheduleItem {
    week_day: number;
    from: string;
    to: string
}


export default class ClassesController {
    async index(request: Request, response: Response){
        const filters = request.query;
        
        const subject = filters.subject as string;
        const week_day = filters.week_day as string;
        const time = filters.time as string
        // não pode fazer a busca sem todos esses dados
        if(!filters.week_day || !filters.subject || !filters.time){
            return response.status(400).json({
                error: 'Missing filters to search classes'
            })
        }

        const timeinMinutes = convertHourToMinutes(time)

        const classes = await db('classes')
            .whereExists(function() {
                this.select('class-schedule.*') //selecionar todos os campos da tabela class_schedule
                    .from('class-schedule')
                    .whereRaw('`class-schedule`.`class_id` = `classes`.`id`')
                    .whereRaw('`class-schedule`.`week_day` = ??', [Number(week_day)])
                    .whereRaw('`class-schedule`.`from` <= ??', [timeinMinutes])
                    .whereRaw('`class-schedule`.`to` > ??', [timeinMinutes])
            })
            .where('classes.subject', '=', subject)
            .join('users', 'classes.user_id', '=', 'users.id')
            .select(['classes.*', 'users.*'])

        return response.json(classes)
    }
    async create(request: Request, response: Response) {
        const {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            schedule
        } = request.body
    
        const trx = await db.transaction()
    
        try{
            const insertedUserIds = await trx('users').insert({
                name,
                avatar,
                whatsapp,
                bio,
            })
        
            const user_id = insertedUserIds[0]
        
            const insertedClassesIds = await trx('classes').insert({
                subject,
                cost,
                user_id,
            })
        
            const class_id = insertedClassesIds[0]
        
            const classSchedule = schedule.map((scheduleItem : ScheduleItem) => {
                return {
                    class_id,
                    week_day: scheduleItem.week_day,
                    from: convertHourToMinutes(scheduleItem.from),
                    to: convertHourToMinutes(scheduleItem.to),
                }
            })
        
            await trx('class-schedule').insert(classSchedule)
        
            await trx.commit() //faz tudo no banco no final
        
            return response.status(201).send() //201: criado com sucesso
        } catch(err){
            console.log(err)
            await trx.rollback() //desfaz qualquer alteração feita no banco.
    
            return response.status(400).json({
                error: 'Unexpected error while creating new class'
            })
        }
    }
}