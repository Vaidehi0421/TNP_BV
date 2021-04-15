const Joi = require('joi');
const { number } = require('joi');

module.exports.adminSchema = Joi.object({
    admin: Joi.object({
        name: Joi.string().required(),
        username: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9+_.-]+@banasthali.in$')).email({ minDomainSegments: 2, tlds: { allow: ['in'] } }),
        // image: Joi.string().required(),
        password: Joi.string()
        .required(),
        contact_number: Joi.string().required().length(10).pattern(new RegExp('^[0-9]+$'))
    }).required()
});

module.exports.companySchema = Joi.object({
      company: Joi.object({
        cname: Joi.string().required(),
        name: Joi.string().required(),
        username: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: false } }),
        contact_number: Joi.string().required().length(10).pattern(new RegExp('^[0-9]+$')),
        company_description: Joi.string()
      }).required(),
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
      .required()
});

module.exports.eventSchema = Joi.object({
    events: Joi.object({
        title: Joi.string(),
        description: Joi.string().required(),
        issue_date: Joi.date().required(),
        expiry_date: Joi.date().greater(Joi.ref('issue_date')).required()
    }).required()
});

module.exports.noticeSchema = Joi.object({
    notices: Joi.object({
        title: Joi.string(),
        description: Joi.string().required(),
        issue_date: Joi.date().required(),
        expiry_date: Joi.date().greater(Joi.ref('issue_date')).required()
    }).required()
});

module.exports.studentSchema = Joi.object({
    student: Joi.object({
        name: Joi.string().required(),
        username: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9+_.-]+@banasthali.in$')).email({ minDomainSegments: 2, tlds: { allow: ['in'] } }),
        password: Joi.string()
      .required(),
        smartcard_id: Joi.string().required(),
        active_backlog: Joi.boolean().required(),
        dob: Joi.date().less('now'),
        // image: Joi.string().required(),
        contact_number: Joi.string().required().length(10).pattern(new RegExp('^[0-9]+$')),
        cgpa: Joi.number().min(0).max(10),
        branch: Joi.required(),
        tenth_marks: Joi.number().required(),
        twelfth_marks: Joi.number().required()
    }).required()

});

module.exports.jobSchema = Joi.object({
    jobs: Joi.object({
        title: Joi.string().required(),
        job_description: Joi.string().required(),
        marks_criteria: Joi.number().min(0).max(10)
    })
});