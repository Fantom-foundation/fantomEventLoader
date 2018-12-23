drop table consensus_events;
create table consensus_events (
  hash varchar(100),
	processed boolean
);

drop table consensus_events_data;
create table consensus_events_data (
  hash varchar(100),
	payload json,
	event_time timestamp,
	index numeric
);

drop table blocks;
create table blocks (
  block_number numeric,
	payload json,
	processed boolean
);

drop table rounds;
create table rounds (
  round_number numeric,
	payload json
);


drop table accounts;
create table accounts (
	address char(42),
	balance char(22),
	nonce numeric
)

/* go-lachesis */
/stats/
/participants/
/events/
/consensus_events/
/rounds/
/round_witnesses/
/round_events/
/block/

/* go-evm */
/account/{address}
/accounts/ /* Controlled by node */
/block/{hash}
/blockById/{id}
/tx/{tx_hash}


drop table blocks;
create table blocks (
hash varchar(100) primary key,
index numeric,
round numeric,
payload json
)

create table transactions (
hash varchar(100) primary key,
root varchar(100),
"from" varchar(100),
"to" varchar(100),
value numeric,
gas numeric,
used numeric,
price numeric,
cumulative numeric,
contract varchar(100),
logsBloom text,
error varchar(100),
failed boolean,
status numeric
)
