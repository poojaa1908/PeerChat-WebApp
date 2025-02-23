Wells Fargo Fresher Onboarding Assistant Bot – Design Document
1. Agent Overview
Agent Name: Wells Fargo Fresher Assistant
Agent Description:
The Wells Fargo Fresher Assistant is a virtual chatbot designed to assist new employees with their preboarding and post-onboarding processes at Wells Fargo. It provides 24/7 support to answer common queries regarding document submission, travel allowance, software installations, access requests, approval tracking, and IT-related troubleshooting. The chatbot reduces dependency on HR, IT, and support teams by providing automated responses, approval tracking, and email notifications for pending approvals.

Agent Instructions (Bot Behavior & Tasks):
Provide accurate and scripted responses to employee queries.
Guide users through document submission and Workday procedures.
Assist with basic software access requests (e.g., Jira, Confluence, GitHub).
Track request statuses from AIMS Portal and trigger reminder emails to managers if approvals are delayed.
Answer technical queries related to software installation, Cloud PC, VPN, RSA, and Microsoft Authenticator setup.
Maintain conditional logic for approval tracking to decide whether to notify the manager.
Escalate to HR or IT support if the bot cannot resolve an issue.
2. Agent Actions & Triggers
Agent Actions (Automated Tasks):
Tracking & Displaying AIMS Portal Request Status

If request is less than 2 days old → Display "In Process".
If request is older than 2 days → Fetch manager details from the organization tree and send a reminder email with employee information.
Sending Email Notifications to Managers

If a request exceeds 2 days, an email notification will be sent to the respective manager, including:
Employee Name
KID (Wells Fargo Employee ID)
LOB (Line of Business)
Role
Request Details
Providing Workday Document Submission Guidance

Guide users through legal name validation, ABC International Questionnaire, and document review.
Providing Software Installation Steps

Provide step-by-step installation guides for tools available in Software Market & Company Portal.
Troubleshooting VPN, RSA, & Microsoft Authenticator

Resolve common issues regarding remote access authentication.
Triggers:
When a mail arrives from the AIMS portal:

Extract the request ID & status and display the progress to the user.
If request is pending for more than 2 days, trigger an email reminder.
When a user submits a request for software installation assistance:

Provide LOB-based software setup steps.
When a user requests access to an enterprise tool:

Guide them through the request process and provide a tracking mechanism.
When a user requests VPN or remote access troubleshooting:

Offer step-by-step solutions and escalate to IT support if needed.
3. Custom Topics & Conditional Branches
Topic 1: Workday Document Submission Help
Trigger Phrases:

"How do I validate my legal name?"
"Where do I submit my ABC International Questionnaire?"
"What documents are required on onboarding day?"
"I need help with Workday submissions."
"How do I review my submitted documents?"
Conditional Branches:

If the user needs Legal Name Validation guidance, provide a step-by-step guide.
If the user needs ABC International Questionnaire help, explain common mistakes & solutions.
If the user asks about document submission, display the list of required documents.
If the user needs Workday login help, redirect them to the Workday login page.
Topic 2: Travel & Accommodation Assistance
Trigger Phrases:

"Am I eligible for a travel allowance?"
"How do I book my flight?"
"Where will I stay during onboarding?"
"Will I be reimbursed for travel expenses?"
"Who should I contact for travel queries?"
Conditional Branches:

If the user qualifies for travel allowance, provide reimbursement details.
If the user needs flight booking assistance, guide them through the corporate booking portal.
If the user asks about accommodation, display hotel details & check-in process.
If the user has additional travel queries, direct them to the HR travel support team.
Topic 3: AIMS Portal Request Tracking
Trigger Phrases:

"What is my AIMS request status?"
"Is my Confluence access request approved?"
"How long does it take to approve Jira access?"
"Track my software request."
"Can you remind my manager about my pending request?"
Conditional Branches:

If request is under 2 days, respond "In Process, please wait".
If request exceeds 2 days, fetch manager’s email from the organization tree and send a reminder.
If request ID is invalid, prompt the user to re-enter a correct ID.
Topic 4: Enterprise Software Access & Installation
Trigger Phrases:

"How do I request Jira access?"
"Can I get Confluence access?"
"Where do I request GitHub enterprise access?"
"How to install software from the portal?"
"I need help with my development environment setup."
Conditional Branches:

If the user requests enterprise tool access, provide a request form link.
If the user wants software installation steps, provide LOB-specific installation guides.
If the user faces installation errors, redirect to IT support.
Topic 5: VPN, Cloud PC, and Remote Access Help
Trigger Phrases:

"How do I connect to Cloud PC?"
"Why is my VPN not working?"
"I need help with RSA authentication."
"How do I set up Microsoft Authenticator?"
"I’m unable to access remote systems."
Conditional Branches:

If the user needs Cloud PC setup, provide a step-by-step guide.
If the user has VPN connectivity issues, troubleshoot with common fixes.
If the user needs RSA authentication setup, provide setup & reset steps.
If the user has Microsoft Authenticator issues, direct them to company security settings.
4. Limitations & Constraints
GPT-4.0 Turbo as Backend

The chatbot cannot use GPT-4.0 Turbo directly due to Wells Fargo’s compliance restrictions. Instead, it must use Microsoft Copilot Studio’s predefined scripts.
No Direct Workday or AIMS Modifications

The bot cannot update, approve, or modify requests—only track and notify.
Limited LOB-Specific Customization

The bot provides general onboarding guidance but cannot handle team-specific configurations.
Manager Notifications Based on Available Data

If the organization tree is not accessible, the bot cannot fetch manager details and notify them.
5. Related Personas
New Joiners (Freshers & Lateral Hires) → Main users of the bot.
HR Team → Provides travel, accommodation, and onboarding information.
IT Support Team → Handles unresolved software & VPN issues.
Managers → Receive request approval reminders.
6. Knowledge Base Sources
HR Onboarding Portal → Travel & document submission guidelines.
Workday Help Center → Document upload process.
AIMS Portal Documentation → Access request tracking.
Software Market & IT Support Docs → Installation guides.
Security & Remote Access Docs → VPN, RSA, Microsoft Authenticator FAQs.
