
INSERT INTO users (id, name, role, active, joined) VALUES
  ('m1', 'Amisha', 'Admin', 1, 'Jan 15, 2022'),
  ('m2', 'Amrita Ji', 'Admin', 1, 'Founding Member'),
  ('m3', 'Hemal', 'Member', 1, 'Mar 10, 2022'),
  ('m4', 'Drashti', 'Member', 1, 'Aug 05, 2022'),
  ('m5', 'Kavya', 'Member', 1, 'Nov 20, 2021'),
  ('m6', 'Mina', 'Member', 1, 'Sep 01, 2023');

INSERT INTO projects (id, name, description, start_date, target_end_date, status) VALUES
  ('p1', 'Collection Development', 'Developing the new summer collection incorporating natural indigo dyeing and traditional Kasuti embroidery on Ajrakh base fabrics.', 'Sep 1, 2023', 'Nov 30, 2023', 'Active'),
  ('p2', 'Mumbai Store', 'Retail setup for the new Mumbai location with VM layout, shelf planning, and inventory display.', 'Oct 1, 2023', 'Dec 15, 2023', 'Active'),
  ('p3', 'Website', 'Online store revamp with new collection photos, product descriptions, and updated CMS.', 'Aug 15, 2023', 'Oct 31, 2023', 'Active'),
  ('p4', 'Social Media', 'Daily content creation and scheduling across Instagram and newsletter.', 'Ongoing', 'Ongoing', 'Active'),
  ('p5', 'Exhibition', 'Preparation for the Crafts Council exhibition including booth layout and sample inventory.', 'Nov 1, 2023', 'Nov 5, 2023', 'Active'),
  ('p6', 'General', 'Studio operations and miscellaneous administrative tasks.', 'Ongoing', 'Ongoing', 'Active');

INSERT INTO tasks (id, name, project_id, lead_id, state, due_date, overdue, completed_date, manager_notes) VALUES
  ('t1', 'Finalize saree costing', 'p1', 'm2', 'In Progress', 'Oct 12, 2023', 1, NULL, '[{"author":"Amrita Ji","date":"Oct 11, 2023","note":"Wants an update by Friday. If the margin doesn''t work on the Ajrakh pieces, we may need to revisit the retail pricing for that sub-collection."}]'),
  ('t2', 'Review Kasuti samples', 'p1', 'm1', 'Review', 'Oct 15, 2023', 0, NULL, '[{"author":"Amrita Ji","date":"Oct 14, 2023","note":"Keep an eye on artisan turnaround time. We may need to reorder Ajrakh yardage if we go with more than 3 pairings."}]'),
  ('t3', 'Visit Ajrakh artisan', 'p1', 'm1', 'Waiting', 'Oct 18, 2023', 0, NULL, '[{"author":"Amrita Ji","date":"Oct 16, 2023","note":"If the indigo samples come back inconsistent, we should consider a second artisan cluster as backup."}]'),
  ('t4', 'Approve VM layout', 'p2', 'm3', 'Review', 'Oct 10, 2023', 1, NULL, '[{"author":"Amrita Ji","date":"Oct 9, 2023","note":"Make sure the new collection is placed near the entrance for visibility during the festive season."}]'),
  ('t5', 'Upload website photos', 'p3', 'm4', 'Review', 'Oct 10, 2023', 0, NULL, '[{"author":"Amrita Ji","date":"Oct 9, 2023","note":"Confirm with Drashti that product descriptions are ready before the photos go live."}]'),
  ('t10', 'Draft collection story', 'p1', 'm4', 'Review', 'Oct 20, 2023', 0, NULL, '[{"author":"Amrita Ji","date":"Oct 19, 2023","note":"Keep the story short enough to use across both the website and exhibition signage."}]'),
  ('t11', 'Create moodboard', 'p1', 'm1', 'Done', 'Sep 20, 2023', 0, 'Sep 20, 2023', '[{"author":"Amisha","date":"Sep 20, 2023","note":"No open items."}]'),
  ('t12', 'Initial fabric sourcing', 'p1', 'm2', 'Done', 'Sep 15, 2023', 0, 'Sep 15, 2023', '[{"author":"Amrita Ji","date":"Sep 15, 2023","note":"No open items."}]'),
  ('t13', 'Cancel screen print trials', 'p1', 'm1', 'Cancelled', NULL, 0, 'Sep 10, 2023', '[{"author":"Amisha","date":"1 week ago","note":"No open items."}]'),
  ('t14', 'Finalize exhibition inventory', 'p5', 'm6', 'To Do', 'Oct 28, 2023', 0, NULL, '[]');

INSERT INTO subtasks (id, task_id, name, completed, completed_by, completed_at) VALUES
  ('st001', 't1', 'Confirm zari and thread rates with supplier', 1, 'Kavya', '3 days ago'),
  ('st002', 't1', 'Add weaving and finishing charges', 1, 'Amisha', '1 day ago'),
  ('st003', 't1', 'Review margin with Amrita Ji', 0, NULL, NULL),
  ('st004', 't1', 'Share final costing sheet with accounts', 0, NULL, NULL),
  ('st005', 't2', 'Collect samples from Kasuti artisan cluster', 1, 'Amisha', '5 days ago'),
  ('st006', 't2', 'Shortlist 3 motif variations', 1, 'Amisha', '2 days ago'),
  ('st007', 't2', 'Pair shortlisted motifs with Ajrakh fabric', 0, NULL, NULL),
  ('st008', 't3', 'Confirm visit date with artisan cluster', 1, 'Amisha', '4 days ago'),
  ('st009', 't3', 'Prepare list of dye and motif references', 0, NULL, NULL),
  ('st010', 't3', 'Arrange travel to Ajrakhpur', 0, NULL, NULL),
  ('st011', 't4', 'Share layout mockup with Amrita Ji', 1, 'Hemal', '2 days ago'),
  ('st012', 't4', 'Confirm shelf placement for new collection', 0, NULL, NULL),
  ('st013', 't5', 'Select final shots from photoshoot', 1, 'Drashti', '1 day ago'),
  ('st014', 't5', 'Resize and optimize images', 0, NULL, NULL),
  ('st015', 't5', 'Upload to website CMS', 0, NULL, NULL),
  ('st016', 't10', 'Write narrative around indigo and Ajrakh craft', 1, 'Drashti', '2 days ago'),
  ('st017', 't10', 'Share draft with Amrita Ji for review', 0, NULL, NULL),
  ('st018', 't11', 'Collect fabric and motif references', 1, 'Amisha', '2 weeks ago'),
  ('st019', 't11', 'Build moodboard in Figma', 1, 'Amisha', '2 weeks ago'),
  ('st020', 't12', 'Shortlist fabric suppliers', 1, 'Amrita Ji', '3 weeks ago'),
  ('st021', 't12', 'Order base fabric samples', 1, 'Amrita Ji', '3 weeks ago'),
  ('st022', 't13', 'Notify printing vendor of cancellation', 1, 'Amisha', '1 week ago'),
  ('st023', 't14', 'Count sample stock by category', 0, NULL, NULL),
  ('st024', 't14', 'Print inventory sheet for booth', 0, NULL, NULL);

INSERT INTO updates (id, project_id, project_name, task_id, task_name, author, time, text, state) VALUES
  ('p4-post1', 'p4', 'Social Media', NULL, NULL, 'Drashti', 'Yesterday', 'New collection reel drafted', NULL),
  ('p4-post2', 'p4', 'Social Media', NULL, NULL, 'Amisha', '2 days ago', 'Scheduled posts for the week', NULL),
  ('p5-post1', 'p5', 'Exhibition', NULL, NULL, 'Hemal', 'Yesterday', 'Inventory list shared in Google Sheets', NULL),
  ('p5-post2', 'p5', 'Exhibition', NULL, NULL, 'Amrita Ji', '3 days ago', 'Booth layout finalized', NULL),
  ('t1-post1', 'p1', 'Collection Development', 't1', 'Finalize saree costing', 'Kavya', '1 day ago', 'Costing completed and shared with accounts. A couple of the Ajrakh sarees are running slightly over the target price.', 'Review'),
  ('t1-post2', 'p1', 'Collection Development', 't1', 'Finalize saree costing', 'Amisha', '4 days ago', 'Starting the costing sheet for the new saree line. Using the revised rates from the weaving cluster.', NULL),
  ('t2-post1', 'p1', 'Collection Development', 't2', 'Review Kasuti samples', 'Amisha', '2 days ago', 'Waiting for revised Ajrakh samples before we can finalize the Kasuti pairing. Motif shortlist is ready though.', 'Review'),
  ('t3-post1', 'p1', 'Collection Development', 't3', 'Visit Ajrakh artisan', 'Amisha', '2h ago', 'Visited artisan today and discussed natural indigo dyeing. Samples expected in about two weeks.', 'Waiting'),
  ('t4-post1', 'p2', 'Mumbai Store', 't4', 'Approve VM layout', 'Hemal', '4h ago', 'VM layout ready for review. Setup can begin at the store this weekend once approved.', 'Review'),
  ('t5-post1', 'p3', 'Website', 't5', 'Upload website photos', 'Drashti', 'Yesterday', 'Photos uploaded to Google Drive. The lighting on the new collection shots came out well.', 'Review'),
  ('t10-post1', 'p1', 'Collection Development', 't10', 'Draft collection story', 'Drashti', '2 days ago', 'First draft of the collection story is ready for review.', 'Review'),
  ('t11-post1', 'p1', 'Collection Development', 't11', 'Create moodboard', 'Amisha', '2 weeks ago', 'Collection moodboard finalized and shared with the team in Figma.', 'Done'),
  ('t12-post1', 'p1', 'Collection Development', 't12', 'Initial fabric sourcing', 'Amrita Ji', '3 weeks ago', 'Base fabric sourcing wrapped up, samples approved for the collection.', 'Done'),
  ('t13-post1', 'p1', 'Collection Development', 't13', 'Cancel screen print trials', 'Amisha', '1 week ago', 'Decided to go with hand block printing instead, cancelling the screen print trials.', 'Cancelled');

INSERT INTO comments (id, update_id, author, text) VALUES
  ('t1-post1-c1', 't1-post1', 'Amrita Ji', 'Let''s review the margin together tomorrow morning.'),
  ('t2-post1-c1', 't2-post1', 'Drashti', 'I can help pull reference photos for the pairing once samples arrive.'),
  ('t2-post1-c2', 't2-post1', 'Amisha', 'Thanks Drashti, will loop you in.'),
  ('t3-post1-c1', 't3-post1', 'Amrita Ji', 'Great, let''s plan the next visit once samples arrive.'),
  ('t5-post1-c1', 't5-post1', 'Amisha', 'These look great, approved for the website.');

INSERT INTO resources (id, project_id, name, url, type) VALUES
  ('res001', 'p1', 'Costing Sheet', '#', 'Google Sheets'),
  ('res002', 'p1', 'Collection Moodboard', '#', 'Figma'),
  ('res003', 'p1', 'Exhibition Photos', '#', 'Google Drive'),
  ('res004', 'p2', 'VM Layout', '#', 'Figma'),
  ('res005', 'p2', 'Store Budget', '#', 'Google Sheets'),
  ('res006', 'p3', 'Photo Assets', '#', 'Google Drive'),
  ('res007', 'p3', 'Product Copy', '#', 'Google Sheets'),
  ('res008', 'p4', 'Content Calendar', '#', 'Google Sheets'),
  ('res009', 'p5', 'Booth Layout', '#', 'Figma'),
  ('res010', 'p5', 'Inventory List', '#', 'Google Sheets');


